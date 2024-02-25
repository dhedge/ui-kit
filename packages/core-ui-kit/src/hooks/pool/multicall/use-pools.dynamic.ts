import { PoolLogicAbi } from 'abi'
import { AddressZero, DEFAULT_CHAIN_ID, DEFAULT_POLLING_INTERVAL } from 'const'
import chunk from 'lodash.chunk'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'hooks/web3'
import type {
  PoolContractAccountCallParams,
  PoolContractCallParams,
  ContractFunctionReturnType,
  Address,
} from 'types'

const getPoolContracts = ({
  account,
  chainId,
  address,
}: PoolContractAccountCallParams) =>
  [
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'balanceOf',
      chainId,
      args: [account ?? AddressZero],
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'tokenPrice',
      chainId,
      args: [],
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'getFundSummary',
      chainId,
    },
  ] as const

type GetFundSummary = ContractFunctionReturnType<
  typeof PoolLogicAbi,
  'view',
  'getFundSummary'
>

type PoolsMap = Record<
  Address,
  {
    userBalance: string | undefined
    tokenPrice: string | undefined
    totalValue: string | undefined
    totalSupply: string | undefined
    isPrivateVault: boolean | undefined
    performanceFee: string | undefined
    streamingFee: string | undefined
    entryFee: string | undefined
  }
>

const getContracts = (pools: PoolContractAccountCallParams[]) =>
  pools.flatMap(getPoolContracts)

const POOL_CHUNK_SIZE = getPoolContracts({
  account: AddressZero,
  chainId: DEFAULT_CHAIN_ID,
  address: AddressZero,
}).length

export const usePoolsDynamic = (pools: PoolContractCallParams[]) => {
  const { account = AddressZero } = useAccount()

  const result = useReadContracts({
    contracts: getContracts(pools.map((pool) => ({ ...pool, account }))),
    query: {
      refetchInterval: DEFAULT_POLLING_INTERVAL,
      select: (data) =>
        chunk(data, POOL_CHUNK_SIZE).reduce<PoolsMap>(
          (acc, [balanceOf, tokenPrice, getFundSummary], index) => {
            const poolAddress = pools?.[index]?.address ?? AddressZero
            const summary = getFundSummary?.result as GetFundSummary

            return {
              ...acc,
              [poolAddress]: {
                userBalance: balanceOf?.result?.toString(),
                tokenPrice: tokenPrice?.result?.toString(),
                totalValue: summary?.totalFundValue?.toString(),
                totalSupply: summary?.totalSupply?.toString(),
                isPrivateVault: summary?.privatePool,
                performanceFee: summary?.performanceFeeNumerator?.toString(),
                streamingFee: summary?.managerFeeNumerator?.toString(),
                entryFee: summary?.entryFeeNumerator?.toString(),
              },
            }
          },
          {},
        ),
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
