import { optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'

import * as stateHooks from 'core-kit/hooks/state'
import * as tradingHooks from 'core-kit/hooks/trading'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useTradingPriceDiff } from './use-trading-price-diff'

vi.mock('core-kit/hooks/pool', () => ({
  usePoolTokenPrice: vi.fn(),
}))

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
}))

vi.mock('./use-asset-price', () => ({
  useAssetPrice: vi.fn(),
}))

describe('useTradingPriceDiff', () => {
  it('should handle zero send input value', () => {
    const sendAssetAddress = TEST_ADDRESS
    const sendAssetValue = '0'
    const receiveAssetValue = '2'
    const sendTokenPrice = '1'
    const poolTokenPrice = '2'
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }

    expect(Number(sendAssetValue)).toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(poolTokenPrice)

    const { result } = renderHook(() =>
      useTradingPriceDiff({
        sendAssetAddress,
        sendAssetValue,
        receiveAssetValue,
      }),
    )

    expect(result.current).toEqual(0)
  })

  it('should handle zero receive input value', () => {
    const sendAssetAddress = TEST_ADDRESS
    const sendAssetValue = '1'
    const receiveAssetValue = '0'
    const sendTokenPrice = '1'
    const poolTokenPrice = '2'
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(poolTokenPrice)

    const { result } = renderHook(() =>
      useTradingPriceDiff({
        sendAssetAddress,
        sendAssetValue,
        receiveAssetValue,
      }),
    )

    expect(result.current).toEqual(0)
  })

  it('should handle zero send token price', () => {
    const sendAssetAddress = TEST_ADDRESS
    const sendAssetValue = '1'
    const receiveAssetValue = '1'
    const sendTokenPrice = '0'
    const poolTokenPrice = '2'
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(poolTokenPrice)

    const { result } = renderHook(() =>
      useTradingPriceDiff({
        sendAssetAddress,
        sendAssetValue,
        receiveAssetValue,
      }),
    )

    expect(result.current).toEqual(0)
  })

  it('should handle zero receive token price', () => {
    const sendAssetAddress = TEST_ADDRESS
    const sendAssetValue = '1'
    const receiveAssetValue = '1'
    const sendTokenPrice = '1'
    const poolTokenPrice = '0'
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).toEqual(0)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(poolTokenPrice)

    const { result } = renderHook(() =>
      useTradingPriceDiff({
        sendAssetAddress,
        sendAssetValue,
        receiveAssetValue,
      }),
    )

    expect(result.current).toEqual(0)
  })

  it('should calculate diff', () => {
    const sendAssetAddress = TEST_ADDRESS
    const sendAssetValue = '100'
    const receiveAssetValue = '200'
    const sendTokenPrice = '300'
    const poolTokenPrice = '400'
    const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValue(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(poolTokenPrice)

    const { result } = renderHook(() =>
      useTradingPriceDiff({
        sendAssetAddress,
        sendAssetValue,
        receiveAssetValue,
      }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
