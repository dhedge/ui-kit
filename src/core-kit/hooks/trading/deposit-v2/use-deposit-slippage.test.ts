import { act } from '@testing-library/react'

import * as stateHooks from 'core-kit/hooks/state'

import { useSendTokenDebouncedValue } from 'core-kit/hooks/trading'
import { useAppliedDepositSlippage } from 'core-kit/hooks/trading/deposit-v2/use-applied-deposit-slippage'
import { useDepositPriceDiff } from 'core-kit/hooks/trading/deposit-v2/use-deposit-price-diff'
import { useDepositSlippage } from 'core-kit/hooks/trading/deposit-v2/use-deposit-slippage'
import type { TradingPanelState } from 'core-kit/types'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useTradingPanelSettings: vi.fn(),
  useReceiveTokenInput: vi.fn(),
}))
vi.mock('core-kit/hooks/trading', () => ({
  useSendTokenDebouncedValue: vi.fn(),
}))
vi.mock('./use-deposit-price-diff', () => ({ useDepositPriceDiff: vi.fn() }))
vi.mock('core-kit/hooks/utils', () => ({
  useDebounce: vi.fn().mockImplementation((v) => v),
}))
vi.mock('./use-applied-deposit-slippage', () => ({
  useAppliedDepositSlippage: vi.fn(),
}))
const updateSettingsMock = vi.fn()

describe('useDepositSlippage', () => {
  beforeEach(() => {
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockImplementation(
      () => true,
    )
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(() => [
      {} as unknown as TradingPanelState['settings'],
      updateSettingsMock,
    ])
    vi.mocked(stateHooks.useReceiveTokenInput).mockReturnValue([
      { isLoading: false },
    ] as unknown as ReturnType<typeof stateHooks.useReceiveTokenInput>)
    vi.mocked(useAppliedDepositSlippage).mockReturnValue(0)
    vi.mocked(useSendTokenDebouncedValue).mockReturnValue({
      isDebouncing: false,
    } as ReturnType<typeof useSendTokenDebouncedValue>)
  })

  it('should update min slippage including deposit slippage', () => {
    vi.mocked(useDepositPriceDiff)
      .mockImplementationOnce(() => 2.12)
      .mockImplementationOnce(() => -1.13)
      .mockImplementationOnce(() => -2)

    const { rerender } = renderHook(() => useDepositSlippage())
    expect(stateHooks.useIsDepositTradingPanelType).toHaveBeenCalledTimes(1)
    expect(stateHooks.useTradingPanelSettings).toHaveBeenCalledTimes(1)
    expect(useDepositPriceDiff).toHaveBeenCalledTimes(1)
    expect(updateSettingsMock).toHaveBeenCalledTimes(1)
    expect(updateSettingsMock).toHaveBeenCalledWith({ minSlippage: 0 })
    act(() => rerender())
    expect(updateSettingsMock).toHaveBeenCalledTimes(2)
    expect(updateSettingsMock).toHaveBeenLastCalledWith({ minSlippage: 1.13 })

    vi.mocked(useAppliedDepositSlippage).mockReturnValue(1)
    act(() => rerender())
    expect(updateSettingsMock).toHaveBeenCalledTimes(3)
    expect(updateSettingsMock).toHaveBeenLastCalledWith({ minSlippage: 3 })
  })
})
