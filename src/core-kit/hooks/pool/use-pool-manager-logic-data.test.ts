import { DEFAULT_PRECISION, optimism } from 'core-kit/const'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import {
  normalizeFeeIncreaseInfo,
  usePoolManagerLogicData,
} from 'core-kit/hooks/pool/use-pool-manager-logic-data'
import { formatUnits } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolManagerStatic: vi.fn(),
}))

describe('normalizeFeeIncreaseInfo', () => {
  it('should parse feeIncreaseInfo', () => {
    const feeIncreaseInfo = [
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
    ] as const
    const [
      announcedPerformanceFee,
      announcedStreamingFee,
      announcedEntryFee,
      announcedExitFee,
      announcedTimestamp,
    ] = feeIncreaseInfo

    expect(normalizeFeeIncreaseInfo(feeIncreaseInfo)).toEqual({
      announcedPerformanceFee: announcedPerformanceFee.toString(),
      announcedStreamingFee: announcedStreamingFee.toString(),
      announcedEntryFee: announcedEntryFee.toString(),
      announcedExitFee: announcedExitFee.toString(),
      announcedTimestamp: announcedTimestamp.toString(),
    })
  })
})

describe('usePoolManagerLogicData', () => {
  it('should call usePoolManagerStatic with poolAddress and chainId', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const feeInfo = [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)]
    const minDepositUSD = BigInt(0)

    vi.mocked(poolMulticallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { getFeeIncreaseInfo: feeInfo, minDepositUSD },
        }) as unknown as ReturnType<
          typeof poolMulticallHooks.usePoolManagerStatic
        >,
    )

    renderHook(() => usePoolManagerLogicData(poolAddress, chainId))

    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledWith({ address: poolAddress, chainId })
  })

  it('should return normalized fee data', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const feeInfo = [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)]
    const minDepositUSD = BigInt(0)

    vi.mocked(poolMulticallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { getFeeIncreaseInfo: feeInfo, minDepositUSD },
        }) as unknown as ReturnType<
          typeof poolMulticallHooks.usePoolManagerStatic
        >,
    )

    const { result } = renderHook(() =>
      usePoolManagerLogicData(poolAddress, chainId),
    )

    expect(result.current).toEqual({
      ...normalizeFeeIncreaseInfo(feeInfo),
      minDepositUSD: +formatUnits(minDepositUSD ?? '0', DEFAULT_PRECISION),
    })
  })
})
