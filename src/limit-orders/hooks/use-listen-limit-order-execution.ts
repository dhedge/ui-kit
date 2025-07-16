import { useEffect } from 'react'

import {
  SHORTEN_POLLING_INTERVAL,
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import { useWaitForTransactionReceipt } from 'core-kit/hooks/web3'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'
import { useInvalidateLimitOrderQuery } from 'limit-orders/hooks/use-invalidate-limit-order-query'

export const useListenLimitOrderExecution = () => {
  const { pendingTransaction, vaultChainId, vaultAddress } =
    useLimitOrderState()
  const {
    setPendingTransaction,
    onTransactionSuccess,
    onTransactionError,
    onLog,
  } = useLimitOrderActions()
  const invalidateLimitOrderQuery = useInvalidateLimitOrderQuery()

  const { data, error } = useWaitForTransactionReceipt({
    hash: pendingTransaction?.hash ?? undefined,
    chainId: vaultChainId,
    pollingInterval: SHORTEN_POLLING_INTERVAL,
  })

  useEffect(() => {
    if (data) {
      if (pendingTransaction?.action === 'create') {
        onLog?.(TRADING_PANEL_LOG_EVENT.CREATE_LIMIT_SELL_ORDER, {
          [TRADING_LOG_EVENT_PARAM.ADDRESS.NAME]: vaultAddress,
          [TRADING_LOG_EVENT_PARAM.CHAIN_ID.NAME]: vaultChainId,
        })
      }
      invalidateLimitOrderQuery()
      setPendingTransaction(null)
      onTransactionSuccess?.(data.transactionHash)
    }
  }, [
    data,
    invalidateLimitOrderQuery,
    onTransactionSuccess,
    onLog,
    vaultChainId,
    setPendingTransaction,
    pendingTransaction?.action,
    vaultAddress,
  ])

  useEffect(() => {
    if (error && !!pendingTransaction) {
      onTransactionError?.(pendingTransaction.hash)
      setPendingTransaction(null)
    }
  }, [error, onTransactionError, pendingTransaction, setPendingTransaction])
}
