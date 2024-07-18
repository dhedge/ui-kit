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
import { Eip7412 } from 'core-kit/utils/synthetix-v3/eip-7412'
import { TrustedMulticallForwarderBatcher } from 'core-kit/utils/synthetix-v3/multicall-forwarder-batcher'

interface UseOraclesUpdateQueryVariables {
  account?: Address
  chainId: number
  vaultAddress: string
}

// eip-7412: https://eips.ethereum.org/EIPS/eip-7412
// usecannon example, https://github.com/usecannon/cannon/blob/main/packages/website/src/helpers/ethereum.ts

// some of the code is modified from: https://github.com/Synthetixio/erc7412/pull/10

// this is to check and update the oracle data if necessary,
// to ensure all actions executed as expected.

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
      TransactionRequest | null,
      DefaultError,
      TransactionRequest | null,
      [string, UseOraclesUpdateQueryVariables]
    >,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery<
    TransactionRequest | null,
    DefaultError,
    TransactionRequest | null,
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
        return null
      }

      const trustedMulticallForwarderBatcher =
        new TrustedMulticallForwarderBatcher()

      const PythAdapter = (
        await import('../../../utils/synthetix-v3/pyth-adapter')
      ).PythAdapter

      const eip7412 = new Eip7412(
        // Check compatibility
        // Remove casting after viem update https://github.com/Synthetixio/erc7412/blob/main/package.json#L30
        [new PythAdapter(PYTH_API_LINK) as OracleAdapter],
        trustedMulticallForwarderBatcher,
      )

      // use getPositionDebt as the probing transaction
      const txData = encodeFunctionData({
        abi: getContractAbiById('synthetixV3Core'),
        functionName: 'getPositionDebt',
        args:
          SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS[vaultAddress.toLowerCase()] ??
          [],
      })

      let transactions: TransactionRequest[] = []
      try {
        transactions = await eip7412.buildTransactions(publicClient, {
          from: account,
          to: getContractAddressById('synthetixV3Core', chainId),
          data: txData as `0x${string}`,
        })
      } catch (err) {
        console.error(err)
      }

      if (transactions.length > 1) {
        // only execute the prepended txns, so remove the last one
        const prependedCalls = transactions.slice(0, transactions.length - 1)
        return trustedMulticallForwarderBatcher.batch(prependedCalls)
      }

      return null
    },
    ...options,
  })
