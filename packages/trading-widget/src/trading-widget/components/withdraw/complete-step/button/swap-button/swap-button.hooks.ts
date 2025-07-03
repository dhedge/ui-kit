import { WITHDRAW_SWAP_DATA_ERROR } from 'core-kit/const'
import { useIsTransactionLoading } from 'core-kit/hooks/trading/use-is-transaction-loading'
import {
  useCompleteWithdrawSwapData,
  useCompleteWithdrawTransaction,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useHandleCompleteWithdraw } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-handle-complete-withdraw'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useSwapButton = () => {
  const dispatch = useOverlayDispatchContext()
  const withdraw = useCompleteWithdrawTransaction()
  const { isError: isSwapDataError } = useCompleteWithdrawSwapData()
  const { disabled, label, handleTrade } = useHandleCompleteWithdraw({
    withdraw,
  })
  const isLoading = useIsTransactionLoading('swap')

  const handleClick = () => {
    if (isSwapDataError) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: OVERLAY.ERROR_NOTIFICATION,
          isOpen: true,
          meta: {
            error: WITHDRAW_SWAP_DATA_ERROR,
          },
        },
      })
      return
    }
    handleTrade()
  }

  return {
    disabled,
    label,
    handleClick,
    isLoading,
  }
}
