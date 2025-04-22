import { useCallback } from 'react'

import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'

export const useLimitOrderModal = () => {
  const { isModalOpen, pendingTransaction } = useLimitOrderState()
  const { setIsModalOpen } = useLimitOrderActions()
  const onOpen = useCallback(() => setIsModalOpen(true), [setIsModalOpen])
  const onClose = useCallback(() => setIsModalOpen(false), [setIsModalOpen])

  return {
    isModalOpen,
    onOpen,
    onClose,
    isTransactionPending: !!pendingTransaction,
  }
}
