import { act } from '@testing-library/react'

import {
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import {
  useTradingPanelLogger,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

import { useIsPoolManagerAccount } from 'core-kit/hooks/user'

import { renderHook } from 'tests/test-utils'

import { useWithdrawTypeHandler } from './use-withdraw-type-handler'

vi.mock('core-kit/hooks/state')
vi.mock('core-kit/hooks/user')
vi.mock('core-kit/const')

describe('useWithdrawTypeHandler', () => {
  it('should disable multi-asset withdrawal for pool managers', () => {
    const setSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { isMultiAssetWithdrawalEnabled: true },
      setSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useIsPoolManagerAccount).mockReturnValue(true)

    renderHook(() => useWithdrawTypeHandler())

    expect(setSettings).toHaveBeenCalledWith({
      isMultiAssetWithdrawalEnabled: false,
    })
  })

  it('should enable multi-asset withdrawal when setMultiAssetWithdrawal is called', () => {
    const setSettings = vi.fn()
    const log = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { isMultiAssetWithdrawalEnabled: false },
      setSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useTradingPanelLogger).mockReturnValue(log)
    vi.mocked(useIsPoolManagerAccount).mockReturnValue(false)

    const { result } = renderHook(() => useWithdrawTypeHandler())

    act(() => {
      const [, setMultiAssetWithdrawal] = result.current
      setMultiAssetWithdrawal(true)
    })

    expect(setSettings).toHaveBeenCalledWith({
      isMultiAssetWithdrawalEnabled: true,
    })
    expect(log).toHaveBeenCalledWith(
      TRADING_PANEL_LOG_EVENT.MULTI_ASSET_WITHDRAWAL_CHANGE,
      {
        [TRADING_LOG_EVENT_PARAM.IS_MULTI_ASSET.NAME]: 1,
      },
    )
  })

  it('should return the correct values', () => {
    const setSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { isMultiAssetWithdrawalEnabled: true },
      setSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useIsPoolManagerAccount).mockReturnValue(false)

    const { result } = renderHook(() => useWithdrawTypeHandler())
    const [isMultiAsset, , disabled] = result.current
    expect(isMultiAsset).toBe(true)
    expect(disabled).toBe(false)
  })
})
