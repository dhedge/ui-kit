import { useEffect } from 'react'

import {
  useOnTransactionError,
  useOnTransactionSuccess,
  useTradingPanelMeta,
  useTradingPanelModal,
  useTradingPanelTransactions,
} from 'hooks/state'
import { useWaitForTransactionReceipt } from 'hooks/web3'
import type { Address } from 'types/web3.types'
import { getExplorerLink } from 'utils'

export const useTradingResultHandling = () => {
  const [transactions, updatePendingTransactions] =
    useTradingPanelTransactions()
  const updateTradingMeta = useTradingPanelMeta()[1]
  const updateTradingModal = useTradingPanelModal()[1]
  const onTransactionError = useOnTransactionError()
  const onTransactionSuccess = useOnTransactionSuccess()

  const [pendingTransaction] = transactions
  const txHash = pendingTransaction?.txHash
  const action = pendingTransaction?.action
  const isTokenApproveTransaction = action === 'approve'
  const chainId = pendingTransaction?.chainId

  const { data, error } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId,
  })

  useEffect(() => {
    if (data) {
      if (isTokenApproveTransaction) {
        updateTradingMeta({ approvingStatus: 'success' })
      }

      const txHash = data.transactionHash as Address
      if (txHash) {
        const link = getExplorerLink(txHash, 'transaction', chainId)
        updateTradingModal({ link, status: 'Success', action })
        updatePendingTransactions({ type: 'remove', status: 'success', txHash })
        onTransactionSuccess?.(data, action, link)
      }
    }
  }, [
    data,
    isTokenApproveTransaction,
    chainId,
    action,
    onTransactionSuccess,
    updatePendingTransactions,
    updateTradingModal,
    updateTradingMeta,
  ])

  useEffect(() => {
    if (error) {
      if (isTokenApproveTransaction) {
        updateTradingMeta({ approvingStatus: undefined })
      }

      updateTradingModal({
        isOpen: false,
        status: 'None',
        link: '',
        action,
        sendToken: null,
        receiveToken: null,
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
    updateTradingMeta,
    updateTradingModal,
    updatePendingTransactions,
    onTransactionError,
  ])
}
