import { PoolManagerLogicAbi } from 'abi'
import { DEFAULT_PRECISION, optimism } from 'const'
import * as poolHooks from 'hooks/pool'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { formatUnits } from 'utils'

import {
  normalizeFeeIncreaseInfo,
  usePoolManagerLogicData,
} from './use-pool-manager-logic-data'

vi.mock('hooks/web3', () => ({
  useReadContracts: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))

vi.mock('./use-manager-logic-address', () => ({
  useManagerLogicAddress: vi.fn(),
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
  it('should call getFeeIncreaseInfo and minDepositUSD methods on PoolManagerLogicAbi', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const feeInfo = [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
    const minDepositUSD = BigInt(0)

    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: feeInfo }, { result: minDepositUSD }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    renderHook(() => usePoolManagerLogicData(poolAddress, chainId))

    expect(vi.mocked(web3Hooks.useReadContracts)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useReadContracts)).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            abi: PoolManagerLogicAbi,
            functionName: 'getFeeIncreaseInfo',
          }),
          expect.objectContaining({
            abi: PoolManagerLogicAbi,
            functionName: 'minDepositUSD',
          }),
        ]),
      }),
    )
  })

  it('should call useManagerLogicAddress with params', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const feeInfo = [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
    const minDepositUSD = BigInt(0)

    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: feeInfo }, { result: minDepositUSD }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    renderHook(() => usePoolManagerLogicData(poolAddress, chainId))

    expect(vi.mocked(poolHooks.useManagerLogicAddress)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(poolHooks.useManagerLogicAddress)).toHaveBeenCalledWith({
      address: poolAddress,
      chainId,
    })
  })

  it('should return  normalized fee data', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const feeInfo = [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
    const minDepositUSD = BigInt(0)

    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: feeInfo }, { result: minDepositUSD }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
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
