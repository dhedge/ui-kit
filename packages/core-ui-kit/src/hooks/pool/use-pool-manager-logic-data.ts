import { PoolManagerLogicAbi } from 'abi'
import { DEFAULT_PRECISION } from 'const'
import { useManagerLogicAddress } from 'hooks/pool'
import { useContractReads, useContractReadsErrorLogging } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'
import { formatUnits, isZeroAddress } from 'utils'

export const normalizeFeeIncreaseInfo = (
  feeIncreaseInfo?: readonly bigint[] | undefined,
) => {
  const announcedPerformanceFee = feeIncreaseInfo?.[0]?.toString() ?? ''
  const announcedStreamingFee = feeIncreaseInfo?.[1]?.toString() ?? ''
  const announcedEntryFee = feeIncreaseInfo?.[2]?.toString() ?? ''
  const announcedTimestamp = feeIncreaseInfo?.[3]?.toString() ?? ''
  return {
    announcedPerformanceFee,
    announcedStreamingFee,
    announcedEntryFee,
    announcedTimestamp,
  }
}

export const usePoolManagerLogicData = (
  poolAddress: Address,
  chainId: ChainId,
) => {
  const managerLogicAddress = useManagerLogicAddress({
    address: poolAddress,
    chainId,
  })

  const { data } = useContractReads({
    contracts: [
      {
        address: managerLogicAddress,
        abi: PoolManagerLogicAbi,
        functionName: 'getFeeIncreaseInfo',
        chainId,
      },
      {
        address: managerLogicAddress,
        abi: PoolManagerLogicAbi,
        functionName: 'minDepositUSD',
        chainId,
      },
    ],
    enabled: !isZeroAddress(poolAddress),
    staleTime: Infinity,
  })
  useContractReadsErrorLogging(data)

  const feeInfo = data?.[0]?.result as bigint[] | undefined
  const minDepositUSD = data?.[1]?.result as bigint | undefined

  return {
    ...normalizeFeeIncreaseInfo(feeInfo),
    minDepositUSD: +formatUnits(minDepositUSD ?? BigInt(0), DEFAULT_PRECISION),
  }
}
