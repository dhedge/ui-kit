import {
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_SWAP_TRANSACTION_SLIPPAGE,
} from 'core-kit/const'
import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { renderHook } from 'tests/test-utils'

import { useAppliedDepositSlippage } from './use-applied-deposit-slippage'
import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'

vi.mock('core-kit/hooks/state', () => ({
  useTradingPanelSettings: vi.fn(),
}))

vi.mock('./use-is-deposit-with-swap-transaction', () => ({
  useIsDepositWithSwapTransaction: vi.fn(),
}))

describe('useAppliedDepositSlippage', () => {
  it('should return default deposit slippage when slippage is auto and not a deposit with swap transaction', () => {
    vi.mocked(useTradingPanelSettings).mockReturnValueOnce([
      { slippage: 'auto' },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValueOnce(false)

    const { result } = renderHook(() => useAppliedDepositSlippage())
    expect(result.current).toEqual(DEFAULT_DEPOSIT_SLIPPAGE)
  })

  it('should return default swap transaction slippage when slippage is auto and is a deposit with swap transaction', () => {
    vi.mocked(useTradingPanelSettings).mockReturnValueOnce([
      { slippage: 'auto' },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useIsDepositWithSwapTransaction).mockReturnValueOnce(true)

    const { result } = renderHook(() => useAppliedDepositSlippage())
    expect(result.current).toEqual(DEFAULT_SWAP_TRANSACTION_SLIPPAGE)
  })

  it('should return the set slippage when slippage is not auto', () => {
    vi.mocked(useTradingPanelSettings).mockReturnValueOnce([
      { slippage: 1 },
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)

    const { result } = renderHook(() => useAppliedDepositSlippage())
    expect(result.current).toEqual(1)
  })
})
