import { useCallback } from 'react'

import { useLimitOrderActions } from 'limit-orders/hooks/state'
import type {
  OnLimitOrderSettled,
  PendingTransaction,
} from 'limit-orders/providers/state-provider/state-provider.types'

export const useOnLimitOrderSettled = (
  action: PendingTransaction['action'],
): OnLimitOrderSettled => {
  const { setIsModalOpen, reset, setPendingTransaction, onTransactionSettled } =
    useLimitOrderActions()

  return useCallback<OnLimitOrderSettled>(
    (...params) => {
      const [hash] = params
      onTransactionSettled?.(...params)

      if (!hash) {
        return setPendingTransaction(null)
      }

      setPendingTransaction({ hash, action })
      setIsModalOpen(false)
      reset()
    },
    [
      onTransactionSettled,
      setPendingTransaction,
      action,
      setIsModalOpen,
      reset,
    ],
  )
}
