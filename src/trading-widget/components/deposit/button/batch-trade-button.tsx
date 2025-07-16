import type { FC } from 'react'

import { useBatchDeposit } from 'core-kit/hooks/trading/deposit-v2/deposit-transaction/use-batch-deposit'
import { ActionButton } from 'trading-widget/components/common'

import { useDepositTradeButton } from 'trading-widget/components/deposit/button/deposit-trade-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const BatchDepositTradeButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const batchDeposit = useBatchDeposit()
  const { handleClick, label, disabled, isLoading } =
    useDepositTradeButton(batchDeposit)

  return (
    <Button onClick={handleClick} disabled={disabled} loading={isLoading}>
      {label}
    </Button>
  )
}
