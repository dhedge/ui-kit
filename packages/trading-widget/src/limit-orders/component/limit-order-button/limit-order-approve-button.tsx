import type { FC, PropsWithChildren } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useLimitOrderApproveButton } from 'limit-orders/component/limit-order-button/limit-order-approve-button.hooks'
import {useTranslationContext} from "limit-orders/providers/translation-provider";

export const LimitOrderApproveButton: FC<PropsWithChildren> = ({
  children,
}) => {
  const t = useTranslationContext()
  const { isApproved, approveLimitOrder, isApprovePending } =
    useLimitOrderApproveButton()

  if (!isApproved) {
    return (
      <ActionButton onClick={approveLimitOrder} loading={isApprovePending}>
        {t.approve}
      </ActionButton>
    )
  }

  return children
}
