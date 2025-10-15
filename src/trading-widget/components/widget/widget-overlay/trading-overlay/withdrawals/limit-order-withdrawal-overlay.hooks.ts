import { useCallback } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import type { OverlayProps } from 'trading-widget/types'

export const useLimitOrderWithdrawalOverlay = ({ type }: OverlayProps) => {
  const [, updateTradingModal] = useTradingPanelModal()
  const { handleReject } = useOverlayHandlers({ type })
  const [{ link, status }] = useTradingPanelModal()

  const isSuccessTx = status == 'Success'

  const onClose = useCallback(() => {
    updateTradingModal({ isOpen: false })
    handleReject()
  }, [handleReject, updateTradingModal])

  return { onClose, link, isSuccessTx }
}
