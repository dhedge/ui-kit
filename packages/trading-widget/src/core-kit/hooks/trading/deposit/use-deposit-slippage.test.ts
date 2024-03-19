import { act } from '@testing-library/react'

import * as stateHooks from 'core-kit/hooks/state'
import * as tradingHooks from 'core-kit/hooks/trading'

import type { DynamicTradingToken, TradingPanelState } from 'core-kit/types'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useDepositSlippage } from './use-deposit-slippage'

vi.mock('core-kit/hooks/state', () => ({
  useIsDepositTradingPanelType: vi.fn(),
  useSendTokenInput: vi.fn(),
  useTradingPanelSettings: vi.fn(),
}))
vi.mock('core-kit/hooks/trading', () => ({ useTradingPriceDiff: vi.fn() }))
vi.mock('core-kit/hooks/utils', () => ({
  useDebounce: vi.fn().mockImplementation((v) => v),
}))

const updateSettingsMock = vi.fn()

describe('useDepositSlippage', () => {
  beforeEach(() => {
    vi.mocked(stateHooks.useIsDepositTradingPanelType).mockImplementation(
      () => true,
    )
    vi.mocked(stateHooks.useSendTokenInput).mockImplementation(() => [
      {
        address: TEST_ADDRESS,
        value: '1',
      } as unknown as DynamicTradingToken,
      vi.fn(),
    ])
    vi.mocked(stateHooks.useTradingPanelSettings).mockImplementation(() => [
      {} as unknown as TradingPanelState['settings'],
      updateSettingsMock,
    ])
  })

  it('should update deposit slippage', () => {
    const receiveAssetInputValue = '123'

    vi.mocked(tradingHooks.useTradingPriceDiff)
      .mockImplementationOnce(() => 2.12)
      .mockImplementationOnce(() => -1.13)

    const { rerender } = renderHook(() =>
      useDepositSlippage(receiveAssetInputValue),
    )
    expect(stateHooks.useIsDepositTradingPanelType).toHaveBeenCalledTimes(1)
    expect(stateHooks.useSendTokenInput).toHaveBeenCalledTimes(1)
    expect(stateHooks.useTradingPanelSettings).toHaveBeenCalledTimes(1)
    expect(tradingHooks.useTradingPriceDiff).toHaveBeenCalledTimes(1)
    expect(tradingHooks.useTradingPriceDiff).toHaveBeenCalledWith({
      sendAssetAddress: TEST_ADDRESS,
      sendAssetValue: '1',
      receiveAssetValue: receiveAssetInputValue,
    })
    expect(updateSettingsMock).toHaveBeenCalledTimes(1)
    expect(updateSettingsMock).toHaveBeenCalledWith({ minSlippage: 2.12 })
    act(() => rerender())
    expect(updateSettingsMock).toHaveBeenCalledTimes(2)
    expect(updateSettingsMock).toHaveBeenLastCalledWith({ minSlippage: 1.13 })
  })
})
