import type { DefaultError, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { encodeFunctionData } from 'viem'
import type { usePublicClient } from 'wagmi'

import {
  PYTH_API_LINK,
  QUERY_KEYS,
  SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS,
} from 'core-kit/const'
import type { Address, OracleAdapter, TransactionRequest } from 'core-kit/types'
import { getContractAbiById, getContractAddressById } from 'core-kit/utils'
import {
  makeTrustedForwarderMulticall,
  resolvePrependTransaction,
} from 'core-kit/utils/synthetix-v3/eip-7412'

interface UseOraclesUpdateQueryVariables {
  account?: Address
  chainId: number
  vaultAddress: string
}

type UseOraclesUpdateQueryResult = {
  isOracleDataUpdateNeeded: boolean
  prependedTxns: TransactionRequest[]
}

export const DEFAULT_ORACLES_DATA_RESPONSE = {
  isOracleDataUpdateNeeded: false,
  prependedTxns: [],
}

// modified to only build the prepended txs
const buildPrependedTxs = async (
  transactions: TransactionRequest[],
  publicClient: NonNullable<ReturnType<typeof usePublicClient>> | undefined,
  adapters: OracleAdapter[],
  chainId: number,
  maxIter = 100,
): Promise<{
  isOracleDataUpdateNeeded: boolean
  prependedTxns: TransactionRequest[]
}> => {
  const prependedTxns: TransactionRequest[] = []
  for (let i = 0; i < maxIter; i++) {
    let result
    try {
      result = await publicClient?.call(
        makeTrustedForwarderMulticall([
          ...prependedTxns,
          ...transactions,
        ] as TransactionRequest[]),
      )
    } catch (error) {
      console.error(error)
      prependedTxns.push(
        ...(await resolvePrependTransaction(
          error,
          publicClient,
          adapters,
          chainId,
        )),
      )
      continue
    }
    if (result?.data === undefined) {
      throw new Error('missing return data from multicall')
    }

    const isOracleDataUpdateNeeded = prependedTxns.length > 0

    return {
      isOracleDataUpdateNeeded,
      prependedTxns,
    }
  }

  throw new Error('erc7412 callback repeat exceeded')
}

// eip-7412: https://eips.ethereum.org/EIPS/eip-7412
// usecannon example, https://github.com/usecannon/cannon/blob/main/packages/website/src/helpers/ethereum.ts (may not be updated)

// some of the code, under this erc7412 folder, is modified from: https://github.com/Synthetixio/erc7412

// this is to check and update the oracle data if necessary,
// to ensure all actions executed as expected.
//
// the usage of erc7412 is different from the original proposal,
// because any tx from dHEDGE vault is (trader_EOA_account => dhedge_contract_guard => synthetixV3) instead of (EOA => synthetixV3)
// so we use the write-func, getPositionDebt, to probe and build up the prepended txs as a single multicall and execute it if there is any
//
// desc: https://mirror.xyz/noahlitvin.eth/_R6jCY5JHlPl2q8VvXblCDzQAqptXdz5AhRxfvsVYLc
export const useOraclesUpdateTransactionData = (
  {
    publicClient,
    account,
    chainId,
    vaultAddress,
  }: {
    publicClient: NonNullable<ReturnType<typeof usePublicClient>> | undefined
  } & UseOraclesUpdateQueryVariables,
  options?: Omit<
    UseQueryOptions<
      UseOraclesUpdateQueryResult,
      DefaultError,
      UseOraclesUpdateQueryResult,
      [string, UseOraclesUpdateQueryVariables]
    >,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery<
    UseOraclesUpdateQueryResult,
    DefaultError,
    UseOraclesUpdateQueryResult,
    [string, UseOraclesUpdateQueryVariables]
  >({
    queryKey: [
      QUERY_KEYS.SYNTHETIX_ORACLES_UPDATE,
      {
        chainId,
        vaultAddress,
        account,
      },
    ],
    queryFn: async ({ queryKey: [, param] }) => {
      const { chainId, vaultAddress, account } = param
      if (!account || !publicClient) {
        return DEFAULT_ORACLES_DATA_RESPONSE
      }

      const PythAdapter = (
        await import('../../../utils/synthetix-v3/pyth-adapter')
      ).PythAdapter

      // use getPositionDebt as the probing transaction
      const txData = encodeFunctionData({
        abi: getContractAbiById('synthetixV3Core'),
        functionName: 'getPositionDebt',
        args:
          SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS[vaultAddress.toLowerCase()] ??
          [],
      })

      // operation to probe and execute the required oracle update tx
      const txns = [
        {
          from: account,
          to: getContractAddressById('synthetixV3Core', chainId),
          data: txData,
        },
      ]

      return await buildPrependedTxs(
        txns,
        publicClient,
        [new PythAdapter(PYTH_API_LINK) as OracleAdapter],
        chainId,
      )
    },
    ...options,
  })
