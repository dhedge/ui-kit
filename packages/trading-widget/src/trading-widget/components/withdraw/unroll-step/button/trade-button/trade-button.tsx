import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useWithdrawTradeButton } from 'trading-widget/components/withdraw/unroll-step/button/trade-button/trade-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const WithdrawTradeButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleTrade, disabled, label } = useWithdrawTradeButton()

  return (
    <Button onClick={handleTrade} disabled={disabled}>
      {label}
    </Button>
  )
}
