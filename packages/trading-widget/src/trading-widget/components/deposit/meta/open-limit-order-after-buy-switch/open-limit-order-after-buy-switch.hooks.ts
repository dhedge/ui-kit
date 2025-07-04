import { useCallback, useMemo } from 'react'

import {
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

export const useOpenLimitOrderAfterBuySwitch = () => {
  const { pricingAsset } = useTradingPanelPoolConfig()
  const [{ openLimitOrderModalAfterBuy }, updateSettings] =
    useTradingPanelSettings()

  const setOpenLimitOrderAfterBuy = useCallback(
    (enabled: boolean) => {
      updateSettings({ openLimitOrderModalAfterBuy: enabled })
    },
    [updateSettings],
  )

  return useMemo(
    () => ({
      openLimitOrderModalAfterBuy,
      setOpenLimitOrderAfterBuy,
      displaySwitch: !!pricingAsset,
    }),
    [openLimitOrderModalAfterBuy, pricingAsset, setOpenLimitOrderAfterBuy],
  )
}
