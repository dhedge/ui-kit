import { beforeEach } from 'vitest'

import { optimism } from 'core-kit/const'
import * as poolHooks from 'core-kit/hooks/pool'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import * as stateHooks from 'core-kit/hooks/state'
import * as tradingHooks from 'core-kit/hooks/trading'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useDepositPriceDiff } from './use-deposit-price-diff'

vi.mock('core-kit/hooks/pool', () => ({
  usePoolTokenPrice: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolDynamic: vi.fn(),
}))

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelPoolConfig: vi.fn(),
  useSendTokenInput: vi.fn(),
  useReceiveTokenInput: vi.fn(),
}))

vi.mock('core-kit/hooks/trading', () => ({
  useAssetPrice: vi.fn(),
}))

const poolConfig = { address: TEST_ADDRESS, chainId: optimism.id }

describe('useTradingPriceDiff', () => {
  beforeEach(() => {
    vi.mocked(stateHooks.useTradingPanelPoolConfig).mockReturnValueOnce(
      poolConfig as ReturnType<typeof stateHooks.useTradingPanelPoolConfig>,
    )
  })

  it('should handle zero send input value', () => {
    const sendAssetValue = '0'
    const receiveAssetValue = '2'
    const sendTokenPrice = '1'
    const poolTokenPrice = '2'

    expect(Number(sendAssetValue)).toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValueOnce([
      { value: sendAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValueOnce([
      { value: receiveAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockReturnValueOnce({
      data: { entryFee: '0' },
    } as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>)
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValueOnce(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValueOnce(poolTokenPrice)

    const { result } = renderHook(() => useDepositPriceDiff())

    expect(result.current).toEqual(0)
  })

  it('should handle zero receive input value', () => {
    const sendAssetValue = '1'
    const receiveAssetValue = '0'
    const sendTokenPrice = '1'
    const poolTokenPrice = '2'

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValueOnce([
      { value: sendAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValueOnce([
      { value: receiveAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockReturnValueOnce({
      data: { entryFee: '0' },
    } as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>)
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValueOnce(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValueOnce(poolTokenPrice)

    const { result } = renderHook(() => useDepositPriceDiff())

    expect(result.current).toEqual(0)
  })

  it('should handle zero send token price', () => {
    const sendAssetValue = '1'
    const receiveAssetValue = '1'
    const sendTokenPrice = '0'
    const poolTokenPrice = '2'

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValueOnce([
      { value: sendAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValueOnce([
      { value: receiveAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockReturnValueOnce({
      data: { entryFee: '0' },
    } as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>)
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValueOnce(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValueOnce(poolTokenPrice)

    const { result } = renderHook(() => useDepositPriceDiff())

    expect(result.current).toEqual(0)
  })

  it('should handle zero receive token price', () => {
    const sendAssetValue = '1'
    const receiveAssetValue = '1'
    const sendTokenPrice = '1'
    const poolTokenPrice = '0'

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).toEqual(0)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValueOnce([
      { value: sendAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValueOnce([
      { value: receiveAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockReturnValueOnce({
      data: { entryFee: '0' },
    } as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>)
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValueOnce(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValueOnce(poolTokenPrice)

    const { result } = renderHook(() => useDepositPriceDiff())

    expect(result.current).toEqual(0)
  })

  it('should calculate diff excluding entry fee', () => {
    const entryFee = '1'
    const sendAssetValue = '100'
    const receiveAssetValue = '49'
    const sendTokenPrice = '100'
    const poolTokenPrice = '200'

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValueOnce([
      { value: sendAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValueOnce([
      { value: receiveAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockReturnValueOnce({
      data: { entryFee },
    } as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>)
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(poolTokenPrice)

    const { result } = renderHook(() => useDepositPriceDiff())

    expect(result.current).toMatchSnapshot()
  })

  it('should calculate diff including entry fee', () => {
    const entryFee = '100'
    const sendAssetValue = '100'
    const receiveAssetValue = '49'
    const sendTokenPrice = '100'
    const poolTokenPrice = '200'

    expect(Number(sendAssetValue)).not.toEqual(0)
    expect(Number(receiveAssetValue)).not.toEqual(0)
    expect(Number(sendTokenPrice)).not.toEqual(0)
    expect(Number(poolTokenPrice)).not.toEqual(0)

    vi.mocked(stateHooks.useSendTokenInput).mockReturnValueOnce([
      { value: sendAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useSendTokenInput>)
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValueOnce([
      { value: receiveAssetValue },
    ] as unknown as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(poolMulticallHooks.usePoolDynamic).mockReturnValueOnce({
      data: { entryFee },
    } as unknown as ReturnType<typeof poolMulticallHooks.usePoolDynamic>)
    vi.mocked(tradingHooks.useAssetPrice).mockReturnValue(sendTokenPrice)
    vi.mocked(poolHooks.usePoolTokenPrice).mockReturnValue(poolTokenPrice)

    const { result } = renderHook(() =>
      useDepositPriceDiff({ includesEntryFee: true }),
    )

    expect(result.current).toMatchSnapshot()
  })
})
