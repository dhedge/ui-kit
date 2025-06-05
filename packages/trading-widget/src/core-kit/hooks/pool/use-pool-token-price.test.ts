import { DEFAULT_POLLING_INTERVAL, optimism } from 'core-kit/const'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import * as stateHooks from 'core-kit/hooks/state'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { usePoolTokenPrice } from './use-pool-token-price'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
  useTradingPanelPoolConfigs: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolDynamic: vi.fn(),
}))

describe('usePoolTokenPrice', () => {
  it('should call usePoolDynamic with proper address and chainId', () => {
    const address = TEST_ADDRESS
    const tokenPrice = BigInt(1)
    const poolData = { tokenPrice: '1' }

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementationOnce(
      () =>
        ({ data: { tokenPrice } }) as unknown as ReturnType<
          typeof poolMulticallHooks.usePoolDynamic
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
        chainId: optimism.id,
      }),
    )

    expect(poolMulticallHooks.usePoolDynamic).toHaveBeenCalledTimes(1)
    expect(poolMulticallHooks.usePoolDynamic).toHaveBeenCalledWith({
      address,
      chainId: optimism.id,
      refetchInterval: DEFAULT_POLLING_INTERVAL,
    })
  })

  it('should format contract token price', () => {
    const address = TEST_ADDRESS
    const tokenPrice = '1'
    const poolData = { tokenPrice: '2' }
    const formatterMock = vi.fn()

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementationOnce(
      () =>
        ({
          data: { tokenPrice },
        }) as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>,
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
        chainId: optimism.id,
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

    vi.mocked(poolMulticallHooks.usePoolDynamic).mockImplementationOnce(
      () =>
        ({ data: { tokenPrice } }) as unknown as ReturnType<
          typeof poolMulticallHooks.usePoolDynamic
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
        chainId: optimism.id,
        formatter: formatterMock,
      }),
    )

    expect(formatterMock).toHaveBeenCalledWith(poolData.tokenPrice)
  })
})
