import { DEFAULT_PRECISION } from 'const'
import { usePoolManagerStatic } from 'hooks/pool/multicall'
import type { Address, ChainId } from 'types/web3.types'
import { formatUnits } from 'utils'

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
  const { data: { getFeeIncreaseInfo: feeInfo, minDepositUSD } = {} } =
    usePoolManagerStatic({ address: poolAddress, chainId })

  return {
    ...normalizeFeeIncreaseInfo(feeInfo),
    minDepositUSD: +formatUnits(minDepositUSD ?? BigInt(0), DEFAULT_PRECISION),
  }
}
