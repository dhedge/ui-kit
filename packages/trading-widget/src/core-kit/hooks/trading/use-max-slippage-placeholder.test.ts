import {
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
} from 'core-kit/const'
import * as stateHooks from 'core-kit/hooks/state'
import { renderHook } from 'tests/test-utils'

import { useMaxSlippagePlaceholder } from './use-max-slippage-placeholder'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelSettings: vi.fn(),
  useTradingPanelType: vi.fn(),
}))

vi.mock('trading-widget/providers/config-provider', () => ({
  useConfigContextParams: vi.fn().mockReturnValue({
    defaultWithdrawSlippageScale: DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
    defaultDepositSlippage: DEFAULT_DEPOSIT_SLIPPAGE,
  }),
}))

describe('useMaxSlippagePlaceholder', () => {
  it('should return slippage value for non-auto', () => {
    const tradingType = 'deposit'
    const settings = { slippage: 1, minSlippage: 0.5 }

    expect(settings.slippage).not.toEqual('auto')

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([
      tradingType,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMaxSlippagePlaceholder())

    expect(result.current).toEqual(settings.slippage.toString())
  })

  it('should return minSlippage value for auto', () => {
    const tradingType = 'deposit'
    const settings = { slippage: 'auto', minSlippage: 0.5 }

    expect(settings.slippage).toEqual('auto')

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([
      tradingType,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMaxSlippagePlaceholder())

    expect(result.current).toEqual(settings.minSlippage.toString())
  })

  it('should return DEFAULT_DEPOSIT_SLIPPAGE value for auto and non-determined minSlippage and deposit type', () => {
    const tradingType = 'deposit'
    const settings = { slippage: 'auto', minSlippage: undefined }

    expect(settings.slippage).toEqual('auto')
    expect(settings.minSlippage).toEqual(undefined)
    expect(settings.minSlippage).toEqual(undefined)
    expect(tradingType).toEqual('deposit')

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([
      tradingType,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMaxSlippagePlaceholder())

    expect(result.current).toEqual(DEFAULT_DEPOSIT_SLIPPAGE.toString())
  })

  it('should return scale range value for auto and non-determined minSlippage and withdraw type', () => {
    const tradingType = 'withdraw'
    const settings = { slippage: 'auto', minSlippage: undefined }

    expect(settings.slippage).toEqual('auto')
    expect(settings.minSlippage).toEqual(undefined)
    expect(settings.minSlippage).toEqual(undefined)
    expect(tradingType).toEqual('withdraw')

    vi.mocked(stateHooks.useTradingPanelType).mockReturnValue([
      tradingType,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockReturnValue([
      settings,
      vi.fn(),
    ] as unknown as ReturnType<typeof stateHooks.useTradingPanelSettings>)

    const { result } = renderHook(() => useMaxSlippagePlaceholder())

    expect(result.current).toEqual(
      `auto ${DEFAULT_WITHDRAW_SLIPPAGE_SCALE[0]}-${
        DEFAULT_WITHDRAW_SLIPPAGE_SCALE[
          DEFAULT_WITHDRAW_SLIPPAGE_SCALE.length - 1
        ]
      }`,
    )
  })
})
