import { useEffect } from 'react'

import { EXTREMELY_SHORT_POLLING_INTERVAL } from 'core-kit/const'
import {
  useOnTransactionError,
  useOnTransactionSuccess,
  useTradingPanelModal,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import {
  useInvalidateTradingQueries,
  useWaitForTransactionReceipt,
} from 'core-kit/hooks/web3'
import type { Address } from 'core-kit/types/web3.types'
import { getExplorerLink } from 'core-kit/utils'

export const useTradingResultHandling = () => {
  const [transactions, updatePendingTransactions] =
    useTradingPanelTransactions()
  const updateTradingModal = useTradingPanelModal()[1]
  const onTransactionError = useOnTransactionError()
  const onTransactionSuccess = useOnTransactionSuccess()

  const [pendingTransaction] = transactions
  const txHash = pendingTransaction?.txHash
  const action = pendingTransaction?.action
  const isTokenApproveTransaction = action === 'approve'
  const chainId = pendingTransaction?.chainId
  const { invalidateTradingQueries, invalidateAllowanceQueries } =
    useInvalidateTradingQueries()

  const { data, error } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId,
    pollingInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
  })

  useEffect(() => {
    if (data) {
      const txHash = data.transactionHash as Address
      if (txHash) {
        const link = getExplorerLink(txHash, 'transaction', chainId)
        updateTradingModal({ link, status: 'Success', action })
        updatePendingTransactions({ type: 'remove', status: 'success', txHash })
        onTransactionSuccess?.(data, action, link)
      }

      isTokenApproveTransaction
        ? invalidateAllowanceQueries()
        : invalidateTradingQueries()
    }
  }, [
    data,
    isTokenApproveTransaction,
    chainId,
    action,
    onTransactionSuccess,
    updatePendingTransactions,
    updateTradingModal,
    invalidateAllowanceQueries,
    invalidateTradingQueries,
  ])

  useEffect(() => {
    if (error) {
      updateTradingModal({
        isOpen: false,
        status: 'None',
        link: '',
        action,
        sendTokens: null,
        receiveTokens: null,
      })
      updatePendingTransactions({ type: 'remove', status: 'fail' })

      onTransactionError?.(error, action, chainId, txHash)
    }
  }, [
    error,
    isTokenApproveTransaction,
    action,
    chainId,
    txHash,
    updateTradingModal,
    updatePendingTransactions,
    onTransactionError,
  ])
}
