import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useComponentContext } from 'trading-widget/providers/component-provider'

import { useWithdrawTradeButton } from './trade-button.hooks'

export const WithdrawTradeButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleTrade, disabled, label } = useWithdrawTradeButton()

  return (
    <Button onClick={handleTrade} disabled={disabled}>
      {label}
    </Button>
  )
}
