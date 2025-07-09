import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'
import { LimitOrderProcessingContent } from 'trading-widget/components/widget/widget-overlay/trading-overlay/limit-order/limit-order-processing-content'
import { LimitOrderSuccessContent } from 'trading-widget/components/widget/widget-overlay/trading-overlay/limit-order/limit-order-success-content'
import { useLimitOrderTransactionOverlay } from 'trading-widget/components/widget/widget-overlay/trading-overlay/limit-order/limit-order-transaction-overlay.hooks'
import type { OverlayProps } from 'trading-widget/types'

export const LimitOrderTransactionOverlay: FC<OverlayProps> = (props) => {
  const { onClose, isProcessing } = useLimitOrderTransactionOverlay(props)

  return (
    <Layout.Overlay
      className="dtw-justify-between dtw-gap-y-4"
      onClose={onClose}
    >
      {isProcessing ? (
        <LimitOrderProcessingContent />
      ) : (
        <LimitOrderSuccessContent onClose={onClose} />
      )}
    </Layout.Overlay>
  )
}
