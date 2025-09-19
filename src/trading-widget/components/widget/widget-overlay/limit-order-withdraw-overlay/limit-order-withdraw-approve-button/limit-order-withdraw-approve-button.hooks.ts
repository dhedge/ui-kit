import { useIsLimitWithdrawOrderApproved } from 'core-kit/hooks/trading/limit-order-withdraw/use-is-limit-withdraw-order-approved'
import { useLimitWithdrawApproveTransaction } from 'core-kit/hooks/trading/limit-order-withdraw/use-limit-withdraw-approve-transaction'

export const useLimitOrderWithdrawApproveButton = () => {
  const isApproved = useIsLimitWithdrawOrderApproved()
  const { approveLimitOrder, isApprovePending } =
    useLimitWithdrawApproveTransaction()

  return {
    isApproved,
    approveLimitOrder,
    isApprovePending,
  }
}
