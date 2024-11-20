import { useCallback, useEffect, useMemo } from 'react'

import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useIsPoolManagerAccount } from 'core-kit/hooks/user'

export const useWithdrawTypeHandler = (): [
  boolean,
  (isMultiAsset: boolean) => void,
  boolean,
] => {
  const [settings, setSettings] = useTradingPanelSettings()

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
    },
    [setSettings],
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
