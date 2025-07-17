import { useLimitOrderState } from 'limit-orders/hooks/state'
import { useIsLimitOrderApproved } from 'limit-orders/hooks/use-is-limit-order-approved'
import { useLimitOrderApproveTransaction } from 'limit-orders/hooks/use-limit-order-approve-transaction'

export const useLimitOrderApproveButton = () => {
  const isApproved = useIsLimitOrderApproved()
  const { approveLimitOrder, isApprovePending } =
    useLimitOrderApproveTransaction()
  const {
    form: { termsAccepted },
  } = useLimitOrderState()
  const disabled = !termsAccepted

  return {
    isApproved,
    approveLimitOrder,
    isApprovePending,
    disabled,
  }
}
