import type { FC } from 'react'

import { LimitOrderOverlay } from 'limit-orders/component/limit-order-overlay'
import { Layout } from 'trading-widget/components/common'
import { useLimitSellsOverlay } from 'trading-widget/components/widget/widget-overlay/limit-sells-overlay/limit-sells-overlay.hooks'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import type { OverlayProps } from 'trading-widget/types'

export const LimitSellsOverlay: FC<OverlayProps> = (props) => {
  const { limitOrderThemeConfig } = useConfigContextParams()
  const {
    handleReject,
    chainId,
    address,
    pricingAsset,
    minLimitOrderValue,
    actions,
    closeAllOverlays,
  } = useLimitSellsOverlay(props)

  if (!pricingAsset) {
    return null
  }

  return (
    <Layout.Overlay
      onClose={closeAllOverlays}
      onBack={handleReject}
      className="!dtw-px-2"
      noPadding
    >
      <div className="dtw-mt-8 dtw-px-2 dtw-overflow-y-auto theme-scrollbar">
        <LimitOrderOverlay
          vaultAddress={address}
          vaultChainId={chainId}
          pricingAsset={pricingAsset}
          minAmountInUsd={minLimitOrderValue}
          actions={actions}
          themeConfig={limitOrderThemeConfig}
        />
      </div>
    </Layout.Overlay>
  )
}
