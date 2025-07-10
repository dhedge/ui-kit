import { useCallback } from 'react'

import {
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import { useTradingPanelLogger } from 'core-kit/hooks/state'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'

export const useLimitOrderModal = () => {
  const log = useTradingPanelLogger()
  const { isModalOpen, pendingTransaction } = useLimitOrderState()
  const { setIsModalOpen } = useLimitOrderActions()
  const onOpen = useCallback(() => {
    setIsModalOpen(true)
    log?.(TRADING_PANEL_LOG_EVENT.OPEN_LIMIT_SELL_VIEW, {
      [TRADING_LOG_EVENT_PARAM.SOURCE.NAME]: 'modal',
    })
  }, [log, setIsModalOpen])
  const onClose = useCallback(() => setIsModalOpen(false), [setIsModalOpen])

  return {
    isModalOpen,
    onOpen,
    onClose,
    isTransactionPending: !!pendingTransaction,
  }
}
