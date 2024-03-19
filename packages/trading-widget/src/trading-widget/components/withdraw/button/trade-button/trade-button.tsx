import { useHandleTrade } from 'core-kit/hooks/trading'
import { useWithdraw } from 'core-kit/hooks/trading/withdraw'
import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

export const WithdrawTradeButton: FC = () => {
  const withdraw = useWithdraw()
  // TODO consider transforming label into param for mapping
  const { disabled, label, handleTrade } = useHandleTrade(withdraw)

  return (
    <ActionButton onClick={handleTrade} disabled={disabled}>
      {label}
    </ActionButton>
  )
}
