import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolManagerStatic } from 'core-kit/hooks/pool/multicall'
import type { Address, ChainId } from 'core-kit/types/web3.types'
import { formatUnits } from 'core-kit/utils'

export const normalizeFeeIncreaseInfo = (
  feeIncreaseInfo?: readonly bigint[] | undefined,
) => {
  const announcedPerformanceFee = feeIncreaseInfo?.[0]?.toString() ?? ''
  const announcedStreamingFee = feeIncreaseInfo?.[1]?.toString() ?? ''
  const announcedEntryFee = feeIncreaseInfo?.[2]?.toString() ?? ''
  const announcedExitFee = feeIncreaseInfo?.[3]?.toString() ?? ''
  const announcedTimestamp = feeIncreaseInfo?.[4]?.toString() ?? ''
  return {
    announcedPerformanceFee,
    announcedStreamingFee,
    announcedEntryFee,
    announcedExitFee,
    announcedTimestamp,
  }
}

export const usePoolManagerLogicData = (
  poolAddress: Address,
  chainId: ChainId,
) => {
  const { data: { getFeeIncreaseInfo: feeInfo, minDepositUSD } = {} } =
    usePoolManagerStatic({ address: poolAddress, chainId })

  return {
    ...normalizeFeeIncreaseInfo(feeInfo),
    minDepositUSD: +formatUnits(minDepositUSD ?? BigInt(0), DEFAULT_PRECISION),
  }
}
