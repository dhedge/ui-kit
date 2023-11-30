import { useCallback, useMemo } from 'react'

import { TRADING_LOG_EVENT_PARAM, TRADING_PANEL_LOG_EVENT } from 'const'
import { useTradingPanelLogger, useTradingPanelSettings } from 'hooks/state'
import { useIsPoolManagerAccount } from 'hooks/user'

export const useWithdrawTypeHandler = (): [
  boolean,
  (isMultiAsset: boolean) => void,
  boolean,
] => {
  const [settings, setSettings] = useTradingPanelSettings()
  const log = useTradingPanelLogger()

  const disabled = useIsPoolManagerAccount()

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
