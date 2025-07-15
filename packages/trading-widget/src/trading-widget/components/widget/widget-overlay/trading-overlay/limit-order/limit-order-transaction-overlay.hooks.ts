import { useCallback } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

export const useLimitOrderTransactionOverlay = ({ type }: OverlayProps) => {
  const [{ status }, updateTradingModal] = useTradingPanelModal()
  const { handleReject } = useOverlayHandlers({ type })
  const isProcessing = status === 'Mining'

  const onClose = useCallback(() => {
    updateTradingModal({ isOpen: false })
    handleReject()
  }, [handleReject, updateTradingModal])

  return { onClose, isProcessing }
}
