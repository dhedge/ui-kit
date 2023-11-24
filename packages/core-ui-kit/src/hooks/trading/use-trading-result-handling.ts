import {
  useOnTransactionError,
  useOnTransactionSuccess,
  useTradingPanelMeta,
  useTradingPanelModal,
  useTradingPanelTransactions,
} from 'hooks/state'
import { useWaitForTransaction } from 'hooks/web3'
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

  useWaitForTransaction({
    hash: txHash,
    chainId,
    onSuccess(data) {
      if (isTokenApproveTransaction) {
        updateTradingMeta({ approvingStatus: 'success' })
      }

      const txHash = data?.transactionHash as Address
      if (txHash) {
        const link = getExplorerLink(txHash, 'transaction', chainId)
        updateTradingModal({ link, status: 'Success', action })
        updatePendingTransactions({ type: 'remove', status: 'success', txHash })
        onTransactionSuccess?.(data, action, link)
      }
    },
    onError(error) {
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
    },
  })
}
