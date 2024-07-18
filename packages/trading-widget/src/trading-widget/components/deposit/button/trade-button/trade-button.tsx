import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useComponentContext } from 'trading-widget/providers/component-provider'

import { useDepositTradeButton } from './trade-button.hooks'

export const DepositTradeButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleClick, label, disabled } = useDepositTradeButton()

  return (
    <Button onClick={handleClick} disabled={disabled}>
      {label}
    </Button>
  )
}
