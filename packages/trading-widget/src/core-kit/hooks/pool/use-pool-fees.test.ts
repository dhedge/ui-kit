import { MANAGER_FEE_DENOMINATOR, optimism } from 'core-kit/const'
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
  useTradingPanelEntryFee: vi.fn(),
}))

describe('usePoolFees', () => {
  it('should call usePoolDynamicContractData hook', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: 'performanceFee',
          streamingFee: 'streamingFee',
          entryFee: 'entryFee',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockImplementation(() => [
      0,
      vi.fn(),
    ])

    renderHook(() => usePoolFees({ address, chainId }))

    expect(
      vi.mocked(poolHooks.usePoolDynamicContractData),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolHooks.usePoolDynamicContractData),
    ).toHaveBeenCalledWith({
      address,
      chainId,
    })
  })

  it('should call useTradingPanelEntryFee hook', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: 'performanceFee',
          streamingFee: 'streamingFee',
          entryFee: 'entryFee',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockImplementation(() => [
      0,
      vi.fn(),
    ])

    renderHook(() => usePoolFees({ address, chainId }))

    expect(vi.mocked(stateHooks.useTradingPanelEntryFee)).toHaveBeenCalledTimes(
      1,
    )
  })

  it('should return performanceFee data', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const performanceFee = '1'

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee,
          streamingFee: 'streamingFee',
          entryFee: 'entryFee',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockImplementation(() => [
      0,
      vi.fn(),
    ])

    const { result } = renderHook(() => usePoolFees({ address, chainId }))

    expect(result.current.performanceFee).toEqual(
      formatNumeratorToPercentage(performanceFee, MANAGER_FEE_DENOMINATOR),
    )
  })

  it('should return streamingFee data', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const streamingFee = '1'

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: 'performanceFee',
          streamingFee,
          entryFee: 'entryFee',
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockImplementation(() => [
      0,
      vi.fn(),
    ])

    const { result } = renderHook(() => usePoolFees({ address, chainId }))

    expect(result.current.streamingFee).toEqual(
      formatNumeratorToPercentage(streamingFee, MANAGER_FEE_DENOMINATOR, 2),
    )
  })

  it('should return contract entryFee data', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const entryFee = '1'

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: 'performanceFee',
          streamingFee: 'streamingFee',
          entryFee,
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockImplementation(() => [
      0,
      vi.fn(),
    ])

    const { result } = renderHook(() => usePoolFees({ address, chainId }))

    expect(result.current.entryFee).toEqual(
      formatNumeratorToPercentage(entryFee, MANAGER_FEE_DENOMINATOR, 2),
    )
  })

  it('should return state entryFee data as fallback', () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const entryFee = '0'
    const stateFee = 1

    vi.mocked(poolHooks.usePoolDynamicContractData).mockImplementation(
      () =>
        ({
          performanceFee: 'performanceFee',
          streamingFee: 'streamingFee',
          entryFee,
        }) as ReturnType<typeof poolHooks.usePoolDynamicContractData>,
    )
    vi.mocked(stateHooks.useTradingPanelEntryFee).mockImplementation(() => [
      stateFee,
      vi.fn(),
    ])

    const { result } = renderHook(() => usePoolFees({ address, chainId }))

    expect(result.current.entryFee).toEqual(`${stateFee}%`)
  })
})
