import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useInitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/init-withdraw-button/init-withdraw-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const InitWithdrawButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleTrade, disabled, label, isLoading } = useInitWithdrawButton()

  return (
    <Button onClick={handleTrade} disabled={disabled} loading={isLoading}>
      {label}
    </Button>
  )
}
