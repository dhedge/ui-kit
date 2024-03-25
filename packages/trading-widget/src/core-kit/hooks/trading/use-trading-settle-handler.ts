import { useCallback } from 'react'

import {
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelModal,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import type { PendingTransaction } from 'core-kit/types/trading-panel.types'
import type { UseWriteContractParameters } from 'core-kit/types/web3.types'
import { getExplorerLink } from 'core-kit/utils'

export const useTradingSettleHandler = (
  action: PendingTransaction['action'],
): Required<Required<UseWriteContractParameters>['mutation']>['onSettled'] => {
  const [, setApprovingStatus] = useTradingPanelApprovingStatus()
  const [, updateTradingModal] = useTradingPanelModal()
  const [, updatePendingTransactions] = useTradingPanelTransactions()
  const [, updateSendToken] = useSendTokenInput()

  return useCallback<
    Required<Required<UseWriteContractParameters>['mutation']>['onSettled']
  >(
    (txHash, error, variables) => {
      if (error) {
        if (action === 'approve') {
          setApprovingStatus(undefined)
        }

        updateTradingModal({
          isOpen: false,
          status: 'None',
          link: '',
          sendToken: null,
          receiveToken: null,
        })

        updatePendingTransactions({ type: 'remove', status: 'fail' })
        console.debug(`${action} transaction failed`, error)
        return
      }

      if (txHash) {
        console.debug(`${action} transaction started`, txHash)
        updatePendingTransactions({ type: 'update', txHash })

        const link = getExplorerLink(txHash, 'transaction', variables.chainId)
        updateTradingModal({ isOpen: true, status: 'Mining', link })
        if (action !== 'approve') {
          updateSendToken({ value: '' })
        }
      }
    },
    [
      action,
      setApprovingStatus,
      updatePendingTransactions,
      updateSendToken,
      updateTradingModal,
    ],
  )
}
