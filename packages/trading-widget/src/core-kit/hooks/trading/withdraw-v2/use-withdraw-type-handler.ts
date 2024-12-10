import { useCallback, useEffect, useMemo } from 'react'

import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useIsDhedgeVaultConnected } from 'core-kit/hooks/user'

export const useWithdrawTypeHandler = (): [
  boolean,
  (isMultiAsset: boolean) => void,
  boolean,
] => {
  const [settings, setSettings] = useTradingPanelSettings()

  const disabled = useIsDhedgeVaultConnected()

  // Disable multi asset withdrawal from dHEDGE vaults
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
