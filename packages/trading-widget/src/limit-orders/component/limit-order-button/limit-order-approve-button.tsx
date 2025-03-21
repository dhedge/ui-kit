import type { FC, PropsWithChildren } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useLimitOrderApproveButton } from 'limit-orders/component/limit-order-button/limit-order-approve-button.hooks'

export const LimitOrderApproveButton: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isApproved, approveLimitOrder, isApprovePending } =
    useLimitOrderApproveButton()

  if (!isApproved) {
    return (
      <ActionButton onClick={approveLimitOrder} loading={isApprovePending}>
        Approve
      </ActionButton>
    )
  }

  return children
}
