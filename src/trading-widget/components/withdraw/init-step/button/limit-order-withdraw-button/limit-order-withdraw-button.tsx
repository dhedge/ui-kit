import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useLimitOrderWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/limit-order-withdraw-button/limit-order-withdraw-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const LimitOrderWithdrawButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { label, openLimitOrderWithdrawOverlay } = useLimitOrderWithdrawButton()

  return <Button onClick={openLimitOrderWithdrawOverlay}>{label}</Button>
}
