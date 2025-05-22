import { MANAGER_FEE_DENOMINATOR, optimism } from 'core-kit/const'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import * as stateHooks from 'core-kit/hooks/state'
import { formatNumeratorToPercentage } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolFees } from './use-pool-fees'

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolDynamic: vi.fn(),
}))

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

describe('usePoolFees', () => {
  it('should call usePoolDynamic hook', () => {
    const address = TEST_ADDRESS

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            performanceFee: '1',
            streamingFee: '2',
            entryFee: '3',
            exitFee: '4',
          },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [{}] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() => usePoolFees({ address, chainId: optimism.id }))

    expect(vi.mocked(poolMulticallHooks.usePoolDynamic)).toHaveBeenCalledTimes(
      1,
    )
    expect(vi.mocked(poolMulticallHooks.usePoolDynamic)).toHaveBeenCalledWith({
      address,
      chainId: optimism.id,
    })
  })

  it('should return performanceFee data', () => {
    const address = TEST_ADDRESS
    const performanceFee = '1'

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            performanceFee,
            streamingFee: '2',
            entryFee: '3',
          },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolFees({ address, chainId: optimism.id }),
    )

    expect(result.current.performanceFee).toEqual(
      formatNumeratorToPercentage(performanceFee, MANAGER_FEE_DENOMINATOR),
    )
  })

  it('should return streamingFee data', () => {
    const address = TEST_ADDRESS
    const streamingFee = '1'

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            performanceFee: '2',
            streamingFee,
            entryFee: '3',
          },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolFees({ address, chainId: optimism.id }),
    )

    expect(result.current.streamingFee).toEqual(
      formatNumeratorToPercentage(streamingFee, MANAGER_FEE_DENOMINATOR, 2),
    )
  })

  it('should return entryFee data', () => {
    const address = TEST_ADDRESS
    const entryFee = '1'

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            performanceFee: '3',
            streamingFee: '4',
            entryFee,
          },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolFees({ address, chainId: optimism.id }),
    )

    expect(result.current.entryFee).toEqual(
      formatNumeratorToPercentage(entryFee, MANAGER_FEE_DENOMINATOR, 2),
    )
  })

  it('should return exit fee data', () => {
    const address = TEST_ADDRESS
    const exitFee = '10'

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            performanceFee: '5',
            streamingFee: '6',
            entryFee: '7',
            exitFee,
          },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )

    const { result } = renderHook(() =>
      usePoolFees({ address, chainId: optimism.id }),
    )

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

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementation(
      () =>
        ({
          data: {
            performanceFee: undefined,
            streamingFee: undefined,
            entryFee: undefined,
            exitFee: undefined,
          },
        }) as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
    )
    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackData] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    const { result } = renderHook(() =>
      usePoolFees({ address, chainId: optimism.id }),
    )

    expect(result.current.performanceFee).toEqual('1%')
    expect(result.current.streamingFee).toEqual('2%')
    expect(result.current.entryFee).toEqual('3%')
    expect(result.current.exitFee).toEqual('4%')
  })
})
