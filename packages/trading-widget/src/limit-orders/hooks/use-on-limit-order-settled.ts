import { useCallback } from 'react'

import type { Hash } from 'viem'

import { useLimitOrderActions } from 'limit-orders/hooks/state'

export const useOnLimitOrderSettled = () => {
  const { setIsModalOpen, reset, setPendingTransaction } =
    useLimitOrderActions()

  return useCallback(
    (transaction: Hash | undefined) => {
      if (!transaction) {
        return setPendingTransaction(null)
      }

      setPendingTransaction(transaction)
      setIsModalOpen(false)
      reset()
    },
    [reset, setIsModalOpen, setPendingTransaction],
  )
}
