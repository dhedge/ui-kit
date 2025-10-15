import type { FC, PropsWithChildren } from 'react'

import { ActionButton } from 'trading-widget/components/common'
import { useLimitOrderWithdrawApproveButton } from 'trading-widget/components/widget/widget-overlay/limit-order-withdraw-overlay/limit-order-withdraw-approve-button/limit-order-withdraw-approve-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const LimitOrderWithdrawApproveButton: FC<PropsWithChildren> = ({
  children,
}) => {
  const t = useTranslationContext()
  const { ActionButton: Button = ActionButton } = useComponentContext()

  const { isApproved, approveLimitOrder, isApprovePending } =
    useLimitOrderWithdrawApproveButton()

  if (!isApproved) {
    return (
      <Button onClick={approveLimitOrder} loading={isApprovePending}>
        {t.approve}
      </Button>
    )
  }

  return children
}
