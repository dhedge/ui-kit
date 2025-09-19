import { useCallback } from 'react'

import { useLimitOrderWithdrawTransaction } from 'core-kit/hooks/trading/limit-order-withdraw/use-limit-order-withdraw-transaction'
import { useHandleLimitOrderWithdraw } from 'core-kit/hooks/trading/trade-handlers/use-handle-limit-order-withdraw'
import { useIsTransactionLoading } from 'core-kit/hooks/trading/use-is-transaction-loading'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

const action = 'limit_order_withdraw'

export const useLimitOrderWithdrawButton = () => {
  const dispatch = useOverlayDispatchContext()
  const isLoading = useIsTransactionLoading('limit_order_withdraw')

  const closeOverlay = useCallback(
    () =>
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: { type: OVERLAY.LIMIT_ORDER_WITHDRAW, isOpen: false },
      }),
    [dispatch],
  )

  const limitOrderHandler = useLimitOrderWithdrawTransaction(closeOverlay)
  const { handleLimitOrderWithdraw, label } = useHandleLimitOrderWithdraw({
    limitOrderHandler,
    action,
  })

  return {
    label,
    handleLimitOrderWithdraw,
    isLoading,
  }
}
