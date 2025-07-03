import { useEffect } from 'react'

import { useWaitForCallsStatus } from 'wagmi'

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
import type { Address, Hex } from 'core-kit/types/web3.types'
import { getExplorerLink } from 'core-kit/utils'
import { useOpenLimitSellsOverlay } from 'trading-widget/hooks'

const useBatchTransactionHandling = ({
  batchId,
  updatePendingTransactions,
}: {
  batchId: Hex | undefined
  updatePendingTransactions: ReturnType<typeof useTradingPanelTransactions>[1]
}) => {
  const { data: result } = useWaitForCallsStatus({
    id: batchId,
    pollingInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
    query: { enabled: !!batchId },
  })
  const batchTxHash = result?.receipts?.[0]?.transactionHash

  useEffect(() => {
    if (!batchTxHash) return

    updatePendingTransactions({ type: 'update', txHash: batchTxHash })
  }, [batchTxHash, updatePendingTransactions])
}

export const useTradingResultHandling = () => {
  const [transactions, updatePendingTransactions] =
    useTradingPanelTransactions()
  const updateTradingModal = useTradingPanelModal()[1]
  const onTransactionError = useOnTransactionError()
  const onTransactionSuccess = useOnTransactionSuccess()

  const [pendingTransaction] = transactions
  const batchId = pendingTransaction?.batchId
  const txHash = pendingTransaction?.txHash
  const action = pendingTransaction?.action
  const isTokenApproveTransaction = action === 'approve'
  const chainId = pendingTransaction?.chainId
  const { invalidateTradingQueries, invalidateAllowanceQueries } =
    useInvalidateTradingQueries()

  //open the limit sells overlay after a successful buy transaction
  const openLimitSellsOverlay = useOpenLimitSellsOverlay()

  useBatchTransactionHandling({ batchId, updatePendingTransactions })

  const { data, error } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId,
    pollingInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
    query: { enabled: !!txHash },
  })

  useEffect(() => {
    if (data) {
      const txHash = data.transactionHash as Address
      if (txHash) {
        const link = getExplorerLink(txHash, 'transaction', chainId)
        updateTradingModal({ link, status: 'Success', action })
        updatePendingTransactions({ type: 'remove', status: 'success', txHash })
        onTransactionSuccess?.(data, action, link)

        if (action === 'deposit') {
          openLimitSellsOverlay()
        }
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
    openLimitSellsOverlay,
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
