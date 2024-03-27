import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useWithdrawTradeButton } from './trade-button.hooks'

export const WithdrawTradeButton: FC = () => {
  const { handleTrade, disabled, label } = useWithdrawTradeButton()

  return (
    <ActionButton onClick={handleTrade} disabled={disabled}>
      {label}
    </ActionButton>
  )
}
