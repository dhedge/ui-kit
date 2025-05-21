import { PoolLogicAbi } from 'core-kit/abi'
import { DEFAULT_POLLING_INTERVAL } from 'core-kit/const'
import { useReadContracts } from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractCallParams,
} from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

const getContracts = ({ chainId, address }: PoolContractCallParams) =>
  [
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

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = ([tokenPrice, getFundSummary]: Data) => {
  const summary = getFundSummary?.result

  return {
    tokenPrice: tokenPrice?.result?.toString(),
    totalValue: summary?.totalFundValue?.toString(),
    totalSupply: summary?.totalSupply?.toString(),
    isPrivateVault: summary?.privatePool,
    performanceFee: summary?.performanceFeeNumerator?.toString(),
    streamingFee: summary?.managerFeeNumerator?.toString(),
    entryFee: summary?.entryFeeNumerator?.toString(),
    exitFee: summary?.exitFeeNumerator?.toString(),
    managerAddress: summary?.manager?.toString(),
  }
}

export const usePoolDynamic = ({ address, chainId }: PoolContractCallParams) =>
  useReadContracts({
    contracts: getContracts({ address, chainId }),
    query: {
      enabled: !!address && !isZeroAddress(address),
      refetchInterval: DEFAULT_POLLING_INTERVAL,
      select: selector,
    },
  })
