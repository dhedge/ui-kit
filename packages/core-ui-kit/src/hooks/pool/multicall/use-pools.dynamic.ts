import { PoolLogicAbi } from 'abi'
import { AddressZero, DEFAULT_CHAIN_ID, DEFAULT_POLLING_INTERVAL } from 'const'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'hooks/web3'
import type {
  MulticallReturnType,
  PoolContractAccountCallParams,
  PoolContractCallParams,
  UseReadContractsParameters,
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

const getContracts = (pools: PoolContractAccountCallParams[]) =>
  pools.flatMap(getPoolContracts)

export const POOL_CHUNK_SIZE = getPoolContracts({
  account: AddressZero,
  chainId: DEFAULT_CHAIN_ID,
  address: AddressZero,
}).length

export const usePoolsDynamic = (
  pools: PoolContractCallParams[],
  query?: Pick<
    NonNullable<
      UseReadContractsParameters<ReturnType<typeof getContracts>>['query']
    >,
    'select'
  >,
) => {
  const { account = AddressZero } = useAccount()

  const result = useReadContracts({
    contracts: getContracts(pools.map((pool) => ({ ...pool, account }))),
    query: {
      refetchInterval: DEFAULT_POLLING_INTERVAL,
      ...query,
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
