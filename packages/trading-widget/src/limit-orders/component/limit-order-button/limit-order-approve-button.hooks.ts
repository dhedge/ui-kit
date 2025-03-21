import { useIsLimitOrderApproved } from 'limit-orders/hooks/use-is-limit-order-approved'
import { useLimitOrderApproveTransaction } from 'limit-orders/hooks/use-limit-order-approve-transaction'

export const useLimitOrderApproveButton = () => {
  const isApproved = useIsLimitOrderApproved()
  const { approveLimitOrder, isApprovePending } =
    useLimitOrderApproveTransaction()

  return {
    isApproved,
    approveLimitOrder,
    isApprovePending,
  }
}
