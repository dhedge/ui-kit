import type { FC, PropsWithChildren } from 'react'
import { useCallback } from 'react'

import {
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { LimitOrderModal } from 'limit-orders'
import { useLimitOrderActions } from 'limit-orders/hooks/state'
import type { ThemeProviderConfigProps } from 'limit-orders/providers/theme-provider'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

interface LimitOrderModalProps {
  config?: ThemeProviderConfigProps
}

export const useOpenLimitOrderModal = () => {
  const [{ openLimitOrderModalAfterBuy }] = useTradingPanelSettings()
  const { setIsModalOpen } = useLimitOrderActions()

  return useCallback(() => {
    if (openLimitOrderModalAfterBuy) {
      setIsModalOpen(true)
    }
  }, [openLimitOrderModalAfterBuy, setIsModalOpen])
}

export const LimitOrderProvider: FC<
  PropsWithChildren<LimitOrderModalProps>
> = ({ children, config }) => {
  const { pricingAsset, chainId, address } = useTradingPanelPoolConfig()
  const { minLimitOrderValue } = useConfigContextParams()

  if (!pricingAsset) {
    return children
  }

  return (
    <LimitOrderModal
      vaultAddress={address}
      vaultChainId={chainId}
      pricingAsset={pricingAsset}
      themeConfig={config}
      minAmountInUsd={minLimitOrderValue}
    >
      {() => children}
    </LimitOrderModal>
  )
}
