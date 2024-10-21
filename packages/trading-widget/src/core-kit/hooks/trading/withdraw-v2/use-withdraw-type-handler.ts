import { useCallback, useEffect, useMemo } from 'react'

import {
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import {
  useTradingPanelLogger,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useIsPoolManagerAccount } from 'core-kit/hooks/user'

export const useWithdrawTypeHandler = (): [
  boolean,
  (isMultiAsset: boolean) => void,
  boolean,
] => {
  const [settings, setSettings] = useTradingPanelSettings()
  const log = useTradingPanelLogger()

  const disabled = useIsPoolManagerAccount()

  // Disable multi asset withdrawal for dHEDGE managers
  useEffect(() => {
    if (disabled) {
      setSettings({ isMultiAssetWithdrawalEnabled: false })
    }
  }, [disabled, setSettings])

  const setMultiAssetWithdrawal = useCallback(
    (isMultiAssetWithdrawalEnabled: boolean) => {
      setSettings({ isMultiAssetWithdrawalEnabled })
      log?.(TRADING_PANEL_LOG_EVENT.MULTI_ASSET_WITHDRAWAL_CHANGE, {
        [TRADING_LOG_EVENT_PARAM.IS_MULTI_ASSET.NAME]:
          isMultiAssetWithdrawalEnabled ? 1 : 0,
      })
    },
    [setSettings, log],
  )

  return useMemo(
    () => [
      settings.isMultiAssetWithdrawalEnabled,
      setMultiAssetWithdrawal,
      disabled,
    ],
    [settings.isMultiAssetWithdrawalEnabled, setMultiAssetWithdrawal, disabled],
  )
}
