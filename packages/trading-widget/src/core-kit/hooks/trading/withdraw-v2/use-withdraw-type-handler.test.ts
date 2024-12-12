import { act } from '@testing-library/react'

import {
  useTradingPanelLogger,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

import { useIsDhedgeVaultConnected } from 'core-kit/hooks/user'

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
    vi.mocked(useIsDhedgeVaultConnected).mockReturnValue(true)

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
    vi.mocked(useIsDhedgeVaultConnected).mockReturnValue(false)

    const { result } = renderHook(() => useWithdrawTypeHandler())

    act(() => {
      const [, setMultiAssetWithdrawal] = result.current
      setMultiAssetWithdrawal(true)
    })

    expect(setSettings).toHaveBeenCalledWith({
      isMultiAssetWithdrawalEnabled: true,
    })
  })

  it('should return the correct values', () => {
    const setSettings = vi.fn()
    vi.mocked(useTradingPanelSettings).mockReturnValue([
      { isMultiAssetWithdrawalEnabled: true },
      setSettings,
    ] as unknown as ReturnType<typeof useTradingPanelSettings>)
    vi.mocked(useIsDhedgeVaultConnected).mockReturnValue(false)

    const { result } = renderHook(() => useWithdrawTypeHandler())
    const [isMultiAsset, , disabled] = result.current
    expect(isMultiAsset).toBe(true)
    expect(disabled).toBe(false)
  })
})
