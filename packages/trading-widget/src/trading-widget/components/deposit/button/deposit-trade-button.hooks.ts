import { DEPOSIT_SWAP_DATA_ERROR } from 'core-kit/const'
import { useHandleTrade } from 'core-kit/hooks/trading'
import type { useDeposit } from 'core-kit/hooks/trading/deposit-v2'
import { useSwapDataBasedOnSendToken } from 'core-kit/hooks/trading/deposit-v2'
import type { useBatchDeposit } from 'core-kit/hooks/trading/deposit-v2/deposit-transaction/use-batch-deposit'
import { useIsTransactionLoading } from 'core-kit/hooks/trading/use-is-transaction-loading'
import {
  useConfigContextActions,
  useConfigContextParams,
} from 'trading-widget/providers/config-provider'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useDepositTradeButton = (
  useTradeExecutor: typeof useDeposit | typeof useBatchDeposit,
) => {
  const dispatch = useOverlayDispatchContext()
  const { onAcceptTermsOfUse } = useConfigContextActions()
  const { termsOfUseAccepted } = useConfigContextParams()

  const tradeExecutor = useTradeExecutor()
  const { disabled, label, handleTrade } = useHandleTrade(tradeExecutor)
  const { isError: isSwapDataFetchingError } = useSwapDataBasedOnSendToken()
  const isLoading = useIsTransactionLoading('deposit')

  const handleClick = () => {
    if (isSwapDataFetchingError) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: OVERLAY.NOTIFICATION,
          isOpen: true,
          meta: {
            error: DEPOSIT_SWAP_DATA_ERROR,
          },
        },
      })
      return
    }

    if (termsOfUseAccepted) {
      handleTrade()
    } else {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: OVERLAY.TERMS_OF_USE,
          isOpen: true,
          onConfirm: async (setPendingState) => {
            try {
              setPendingState(true)
              const isAccepted = await onAcceptTermsOfUse()

              if (isAccepted) {
                handleTrade()
              }
            } catch (error) {
              console.error('Failed to verify terms of use acceptance')
            } finally {
              setPendingState(false)
            }
          },
        },
      })
    }
  }

  return {
    handleClick,
    disabled,
    label,
    isLoading,
  }
}
