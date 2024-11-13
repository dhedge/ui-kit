// code from https://github.com/Synthetixio/erc7412

import type { CallExecutionError, Hex } from 'viem'
import { decodeAbiParameters } from 'viem'
import type { usePublicClient } from 'wagmi'

import { IERC7412Abi, ITrustedMulticallForwarderAbi } from 'core-kit/abi'
import { AddressZero, CHAIN_NATIVE_TOKENS } from 'core-kit/const'
import type { Address, OracleAdapter, TransactionRequest } from 'core-kit/types'
import { parseError } from 'core-kit/utils/synthetix-v3/parse-error'
import {
  decodeErrorResult,
  encodeFunctionData,
  hexToString,
  trim,
} from 'core-kit/utils/web3'

const TRUSTED_MULTICALL_FORWARDER_ADDRESS: Address =
  '0xE2C5658cC5C448B48141168f3e475dF8f65A1e3e'

export const LEGACY_ODR_ERROR = [
  {
    type: 'error',
    name: 'OracleDataRequired',
    inputs: [{ type: 'address' }, { type: 'bytes' }],
  },
]

export const makeTrustedForwarderMulticall = (
  transactions: TransactionRequest[],
) => {
  const totalValue = transactions.reduce((val, txn) => {
    return val + (txn.value ?? BigInt(0))
  }, BigInt(0))

  return {
    from: transactions[transactions.length - 1]?.from ?? AddressZero,
    to: TRUSTED_MULTICALL_FORWARDER_ADDRESS,
    value: totalValue,
    data: encodeFunctionData({
      abi: ITrustedMulticallForwarderAbi,
      functionName: 'aggregate3Value',
      args: [
        transactions.map((txn) => ({
          target: txn.to ?? AddressZero,
          callData: txn.data ?? '0x',
          value: txn.value ?? BigInt(0),
          requireSuccess: true,
        })),
      ],
    }),
  }
}

export function resolveAdapterCalls(
  origError: unknown,
  publicClient: NonNullable<ReturnType<typeof usePublicClient>> | undefined,
): Record<Address, Array<{ query: Hex; fee: bigint }>> {
  try {
    const parsedError = parseError(origError as CallExecutionError) as string
    // Errors
    if (parsedError.startsWith('0x0b42fd17')) {
      const splitHexStrs = parsedError.split('0b42fd17')
      // some nested Errors error messed it up, so just got the last one to work with;
      const data = `0x${splitHexStrs.at(-1)}`
      const errorsList = decodeAbiParameters(
        IERC7412Abi.filter((x) => x.name === 'Errors')?.[0]?.inputs ?? [],
        data as Hex,
      )

      const adapterCalls: Record<
        Address,
        Array<{ query: Hex; fee: bigint }>
      > = {}
      for (const error of errorsList[0] as Hex[]) {
        const subAdapterCalls = resolveAdapterCalls(error, publicClient)

        for (const a in subAdapterCalls) {
          if (adapterCalls[a as Address] === undefined) {
            adapterCalls[a as Address] = []
          }

          adapterCalls[a as Address]?.push(
            ...(subAdapterCalls[a as Address] ?? []),
          )
        }
      }

      return adapterCalls
    } else {
      const err = decodeErrorResult({
        abi: [...IERC7412Abi, ...LEGACY_ODR_ERROR],
        data: parseError(origError as CallExecutionError),
      })
      if (err.errorName === 'OracleDataRequired') {
        const oracleQuery = err.args?.[1] as Hex
        const oracleAddress = err.args?.[0] as Address
        const fee = err.args?.[2] as bigint

        return { [oracleAddress]: [{ query: oracleQuery, fee }] }
      }
    }
  } catch (err) {
    console.error(err)
  }

  // if we get to this point then we cant parse the error, so we should make sure to send the original
  throw new Error(
    `could not parse error. can it be decoded elsewhere? ${JSON.stringify(
      origError,
    )}`,
  )
}

export async function resolvePrependTransaction(
  origError: unknown,
  publicClient: NonNullable<ReturnType<typeof usePublicClient>> | undefined,
  adapters: OracleAdapter[],
  chainId: number,
): Promise<TransactionRequest[]> {
  const adapterCalls = resolveAdapterCalls(origError, publicClient)

  const priceUpdateTxs: TransactionRequest[] = []
  for (const a in adapterCalls) {
    const oracleId = hexToString(
      trim(
        (await publicClient?.readContract({
          abi: IERC7412Abi,
          address: a as Address,
          functionName: 'oracleId',
          args: [],
        })) as Hex,
        { dir: 'right' },
      ),
    )

    const adapter = adapters.find((a) => a.getOracleId() === oracleId)
    if (adapter === undefined) {
      throw new Error(
        `oracle ${oracleId} not supported (supported oracles: ${Array.from(
          adapters.map((a) => a.getOracleId()),
        ).join(',')})`,
      )
    }

    const offchainDataCalls = await adapter.fetchOffchainData(
      publicClient,
      a as Address,
      adapterCalls[a as Address],
    )

    for (const call of offchainDataCalls) {
      priceUpdateTxs.push({
        from: CHAIN_NATIVE_TOKENS[chainId]?.address ?? AddressZero,
        to: a as Address,
        value: call.fee,
        data: encodeFunctionData({
          abi: IERC7412Abi,
          functionName: 'fulfillOracleQuery',
          args: [call.arg],
        }),
      })
    }
  }

  return priceUpdateTxs
}
