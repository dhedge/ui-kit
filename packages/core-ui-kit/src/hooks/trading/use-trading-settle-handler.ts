import { useCallback } from 'react'

import {
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelModal,
  useTradingPanelTransactions,
} from 'hooks/state'
import type { SettledCallback } from 'hooks/web3'
import type { PendingTransaction } from 'types/trading-panel.types'
import { getExplorerLink } from 'utils'

export const useTradingSettleHandler = (
  action: PendingTransaction['action'],
) => {
  const [, setApprovingStatus] = useTradingPanelApprovingStatus()
  const [, updateTradingModal] = useTradingPanelModal()
  const [, updatePendingTransactions] = useTradingPanelTransactions()
  const [, updateSendToken] = useSendTokenInput()

  return useCallback<SettledCallback>(
    (data, error, variables) => {
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

      const txHash = data?.hash
      if (txHash) {
        console.debug(`${action} transaction started`, data)
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
