import { DEFAULT_PRECISION, optimism } from 'const'
import * as poolMulticallHooks from 'hooks/pool/multicall'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { formatUnits } from 'utils'

import {
  normalizeFeeIncreaseInfo,
  usePoolManagerLogicData,
} from './use-pool-manager-logic-data'

vi.mock('hooks/pool/multicall', () => ({
  usePoolManagerStatic: vi.fn(),
}))

describe('normalizeFeeIncreaseInfo', () => {
  it('should parse feeIncreaseInfo', () => {
    const feeIncreaseInfo = [
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
    ] as const
    const [
      announcedPerformanceFee,
      announcedStreamingFee,
      announcedEntryFee,
      announcedTimestamp,
    ] = feeIncreaseInfo

    expect(normalizeFeeIncreaseInfo(feeIncreaseInfo)).toEqual({
      announcedPerformanceFee: announcedPerformanceFee.toString(),
      announcedStreamingFee: announcedStreamingFee.toString(),
      announcedEntryFee: announcedEntryFee.toString(),
      announcedTimestamp: announcedTimestamp.toString(),
    })
  })
})

describe('usePoolManagerLogicData', () => {
  it('should call usePoolManagerStatic with poolAddress and chainId', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const feeInfo = [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
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
    const feeInfo = [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
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
