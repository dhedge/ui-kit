import type { FC } from 'react'

import { useDeposit } from 'core-kit/hooks/trading/deposit-v2'
import { ActionButton } from 'trading-widget/components/common'

import { useDepositTradeButton } from 'trading-widget/components/deposit/button/deposit-trade-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const SingleDepositTradeButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const deposit = useDeposit()
  const { handleClick, label, disabled, isLoading } =
    useDepositTradeButton(deposit)

  return (
    <Button onClick={handleClick} disabled={disabled} loading={isLoading}>
      {label}
    </Button>
  )
}
