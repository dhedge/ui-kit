import { useCallback } from 'react'

import type { Hex } from 'viem'
import type { UseSendCallsParameters } from 'wagmi'

import {
  useOnTradingSettleError,
  useSendTokenInput,
  useTradingPanelModal,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import type { PendingTransaction } from 'core-kit/types/trading-panel.types'

type BatchTradingSettleHandler = Required<
  Required<UseSendCallsParameters>['mutation']
>['onSettled']

export const useBatchTradingSettleHandler = (
  action: PendingTransaction['action'],
): BatchTradingSettleHandler => {
  const [, updateTradingModal] = useTradingPanelModal()
  const [, updatePendingTransactions] = useTradingPanelTransactions()
  const [, updateSendToken] = useSendTokenInput()

  const onTradingSettleError = useOnTradingSettleError()

  return useCallback<BatchTradingSettleHandler>(
    (params, error) => {
      if (error) {
        updateTradingModal({
          isOpen: false,
          status: 'None',
          link: '',
          sendTokens: null,
          receiveTokens: null,
        })

        updatePendingTransactions({ type: 'remove', status: 'fail' })
        console.debug(`${action} transaction failed`, error)

        onTradingSettleError?.(error)

        return
      }

      const batchId = params?.id as Hex | undefined

      if (batchId) {
        console.debug(`${action} transaction started, batch id:`, batchId)
        updatePendingTransactions({ type: 'update', batchId })
        updateTradingModal({ isOpen: true, status: 'Mining' })
        updateSendToken({ value: '' })
      }
    },
    [
      updateTradingModal,
      updatePendingTransactions,
      action,
      onTradingSettleError,
      updateSendToken,
    ],
  )
}
