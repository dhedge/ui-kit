import { MANAGER_FEE_DENOMINATOR } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as stateHooks from 'core-kit/hooks/state'
import { formatNumeratorToPercentage } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolFees } from './use-pool-fees'

vi.mock('./use-pool-dynamic-contract-data', () => ({
  usePoolDynamicContractData: vi.fn(),
}))

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

describe('usePoolFees', () => {
  it('should call usePoolDynamicContractData hook', () => {
    const address = TEST_ADDRESS

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: '1',
          streamingFee: '2',
          entryFee: '3',
          exitFee: '4',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [{}] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() => usePoolFees({ address }))

    expect(
      vi.mocked(poolHooks.usePoolDynamicContractData),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolHooks.usePoolDynamicContractData),
    ).toHaveBeenCalledWith({
      address,
    })
  })

  it('should return performanceFee data', () => {
    const address = TEST_ADDRESS
    const performanceFee = '1'

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee,
          streamingFee: '2',
          entryFee: '3',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )

    const { result } = renderHook(() => usePoolFees({ address }))

    expect(result.current.performanceFee).toEqual(
      formatNumeratorToPercentage(performanceFee, MANAGER_FEE_DENOMINATOR),
    )
  })

  it('should return streamingFee data', () => {
    const address = TEST_ADDRESS
    const streamingFee = '1'

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: '2',
          streamingFee,
          entryFee: '3',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )

    const { result } = renderHook(() => usePoolFees({ address }))

    expect(result.current.streamingFee).toEqual(
      formatNumeratorToPercentage(streamingFee, MANAGER_FEE_DENOMINATOR, 2),
    )
  })

  it('should return entryFee data', () => {
    const address = TEST_ADDRESS
    const entryFee = '1'

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: '3',
          streamingFee: '4',
          entryFee,
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )

    const { result } = renderHook(() => usePoolFees({ address }))

    expect(result.current.entryFee).toEqual(
      formatNumeratorToPercentage(entryFee, MANAGER_FEE_DENOMINATOR, 2),
    )
  })

  it('should return exit fee data', () => {
    const address = TEST_ADDRESS
    const exitFee = '10'

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: '5',
          streamingFee: '6',
          entryFee: '7',
          exitFee,
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )

    const { result } = renderHook(() => usePoolFees({ address }))

    expect(result.current.exitFee).toEqual('0.1%')
    expect(result.current.exitFeeNumber).toEqual(0.1)
  })

  it('should rely on fallback fees', () => {
    const address = TEST_ADDRESS
    const fallbackData = {
      performanceFeeNumerator: '100',
      streamingFeeNumerator: '200',
      entryFeeNumerator: '300',
      exitFeeNumerator: '400',
      address,
    }

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: undefined,
          streamingFee: undefined,
          entryFee: undefined,
          exitFee: undefined,
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackData] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    const { result } = renderHook(() => usePoolFees({ address }))

    expect(result.current.performanceFee).toEqual('1%')
    expect(result.current.streamingFee).toEqual('2%')
    expect(result.current.entryFee).toEqual('3%')
    expect(result.current.exitFee).toEqual('4%')
  })
})
