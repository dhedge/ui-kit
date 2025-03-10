import { useEffect } from 'react'

import { EXTREMELY_SHORT_POLLING_INTERVAL } from 'core-kit/const'
import { useWaitForTransactionReceipt } from 'core-kit/hooks/web3'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'
import { useInvalidateLimitOrderQuery } from 'limit-orders/hooks/use-invalidate-limit-order-query'

export const useListenLimitOrderExecution = () => {
  const { pendingTransaction, vaultChainId } = useLimitOrderState()
  const { setPendingTransaction, onTransactionSuccess, onTransactionError } =
    useLimitOrderActions()
  const invalidateLimitOrderQuery = useInvalidateLimitOrderQuery()

  const { data, error } = useWaitForTransactionReceipt({
    hash: pendingTransaction ?? undefined,
    chainId: vaultChainId,
    pollingInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
  })

  useEffect(() => {
    if (data) {
      invalidateLimitOrderQuery()
      setPendingTransaction(null)
      onTransactionSuccess?.(data.transactionHash)
    }
  }, [
    data,
    invalidateLimitOrderQuery,
    onTransactionSuccess,
    setPendingTransaction,
  ])

  useEffect(() => {
    if (error && !!pendingTransaction) {
      onTransactionError?.(pendingTransaction)
      setPendingTransaction(null)
    }
  }, [error, onTransactionError, pendingTransaction, setPendingTransaction])
}
