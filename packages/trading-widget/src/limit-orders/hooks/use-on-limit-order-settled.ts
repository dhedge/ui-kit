import { useCallback } from 'react'

import { useLimitOrderActions } from 'limit-orders/hooks/state'
import type { OnLimitOrderSettled } from 'limit-orders/providers/state-provider/state-provider.types'

export const useOnLimitOrderSettled = (): OnLimitOrderSettled => {
  const { setIsModalOpen, reset, setPendingTransaction, onTransactionSettled } =
    useLimitOrderActions()

  return useCallback<OnLimitOrderSettled>(
    (...params) => {
      const [transaction] = params
      onTransactionSettled?.(...params)

      if (!transaction) {
        return setPendingTransaction(null)
      }

      setPendingTransaction(transaction)
      setIsModalOpen(false)
      reset()
    },
    [reset, setIsModalOpen, setPendingTransaction, onTransactionSettled],
  )
}
