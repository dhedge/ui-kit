import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useDepositTradeButton } from './trade-button.hooks'

export const DepositTradeButton: FC = () => {
  const { handleClick, label, disabled } = useDepositTradeButton()

  return (
    <ActionButton onClick={handleClick} disabled={disabled}>
      {label}
    </ActionButton>
  )
}
