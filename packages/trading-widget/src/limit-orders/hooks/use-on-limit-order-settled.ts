import { useCallback } from 'react'

import type { Hash } from 'viem'

import { useLimitOrderActions } from 'limit-orders/hooks/state'

export const useOnLimitOrderSettled = () => {
  const { setIsModalOpen, reset, setPendingTransaction } =
    useLimitOrderActions()

  return useCallback(
    (transaction: Hash | undefined) => {
      if (transaction) {
        setPendingTransaction(transaction)
        setIsModalOpen(false)
        reset()
        return
      }
      setPendingTransaction(null)
    },
    [reset, setIsModalOpen, setPendingTransaction],
  )
}
