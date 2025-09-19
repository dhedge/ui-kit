import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useLimitOrderWithdrawDeleteTransaction } from 'core-kit/hooks/trading/limit-order-withdraw/use-limit-order-withdraw-delete-transaction'
import { usePendingLimitOrderWithdraw } from 'core-kit/hooks/trading/limit-order-withdraw/use-pending-limit-order-withdraw'
import { useHandleLimitOrderWithdraw } from 'core-kit/hooks/trading/trade-handlers/use-handle-limit-order-withdraw'
import { formatNumberToLimitedDecimals } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

const action = 'delete_limit_order_withdraw'

export const useLimitOrderWithdrawalAlert = () => {
  const { stablePrecision } = useConfigContextParams()
  const { symbol } = useTradingPanelPoolConfig()
  const { hasPendingLimitOrderWithdraw, pendingLimitOrderWithdrawAmount } =
    usePendingLimitOrderWithdraw()

  const limitOrderHandler = useLimitOrderWithdrawDeleteTransaction()
  const { handleLimitOrderWithdraw, label } = useHandleLimitOrderWithdraw({
    limitOrderHandler,
    action,
  })

  return {
    hasPendingLimitOrderWithdraw,
    symbol,
    pendingLimitOrderWithdrawAmount: formatNumberToLimitedDecimals(
      pendingLimitOrderWithdrawAmount,
      stablePrecision,
    ),
    handleLimitOrderWithdraw,
    label,
  }
}
