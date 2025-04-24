import * as stateHooks from 'core-kit/hooks/state'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolDynamicContractData } from './use-pool-dynamic-contract-data'
import { usePoolTokenPrice } from './use-pool-token-price'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
  useTradingPanelPoolConfigs: vi.fn(),
}))

vi.mock('./use-pool-dynamic-contract-data', () => ({
  usePoolDynamicContractData: vi.fn(),
}))

describe('usePoolTokenPrice', () => {
  it('should call usePoolDynamic with proper address and chainId', () => {
    const address = TEST_ADDRESS
    const tokenPrice = BigInt(1)
    const poolData = { tokenPrice: '1' }

    vi.mocked(usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ data: { tokenPrice } }) as unknown as ReturnType<
          typeof usePoolDynamicContractData
        >,
    )
    vi.mocked(
      stateHooks.useTradingPanelPoolFallbackData,
    ).mockImplementationOnce(
      () =>
        [poolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() =>
      usePoolTokenPrice({
        address,
      }),
    )

    expect(usePoolDynamicContractData).toHaveBeenCalledTimes(1)
    expect(usePoolDynamicContractData).toHaveBeenCalledWith({
      address,
    })
  })

  it('should format contract token price', () => {
    const address = TEST_ADDRESS
    const tokenPrice = '1'
    const poolData = { tokenPrice: '2' }
    const formatterMock = vi.fn()

    vi.mocked(usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({
          tokenPrice,
        }) as unknown as ReturnType<typeof usePoolDynamicContractData>,
    )
    vi.mocked(
      stateHooks.useTradingPanelPoolFallbackData,
    ).mockImplementationOnce(
      () =>
        [poolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() =>
      usePoolTokenPrice({
        address,
        formatter: formatterMock,
      }),
    )

    expect(formatterMock).toHaveBeenCalledWith(BigInt(tokenPrice))
  })

  it('should format fallback poolData.tokenPrice', () => {
    const address = TEST_ADDRESS
    const tokenPrice = undefined
    const poolData = { tokenPrice: BigInt(1) }
    const formatterMock = vi.fn()

    vi.mocked(usePoolDynamicContractData).mockImplementationOnce(
      () =>
        ({ data: { tokenPrice } }) as unknown as ReturnType<
          typeof usePoolDynamicContractData
        >,
    )
    vi.mocked(
      stateHooks.useTradingPanelPoolFallbackData,
    ).mockImplementationOnce(
      () =>
        [poolData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    renderHook(() =>
      usePoolTokenPrice({
        address,
        formatter: formatterMock,
      }),
    )

    expect(formatterMock).toHaveBeenCalledWith(poolData.tokenPrice)
  })
})
