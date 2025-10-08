import { PoolLogicAbi } from 'core-kit/abi'
import { useReadContracts } from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractCallParams,
} from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

type UsePoolDynamicParams = PoolContractCallParams & {
  enabled?: boolean
  refetchInterval?: number
}

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
    totalValueD18: summary?.totalFundValue?.toString(),
    totalSupplyD18: summary?.totalSupply?.toString(),
    isPrivateVault: summary?.privatePool,
    performanceFee: summary?.performanceFeeNumerator?.toString(),
    streamingFee: summary?.managerFeeNumerator?.toString(),
    entryFee: summary?.entryFeeNumerator?.toString(),
    exitFee: summary?.exitFeeNumerator?.toString(),
    managerAddress: summary?.manager?.toString(),
  }
}

export const usePoolDynamic = ({
  address,
  chainId,
  refetchInterval,
  enabled = true,
}: UsePoolDynamicParams) =>
  useReadContracts({
    contracts: getContracts({ address, chainId }),
    query: {
      enabled: enabled && !!address && !isZeroAddress(address),
      refetchInterval,
      select: selector,
    },
  })
