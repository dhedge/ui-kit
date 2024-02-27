import { useHandleTrade } from '@dhedge/core-ui-kit/hooks/trading'
import { useWithdraw } from '@dhedge/core-ui-kit/hooks/trading/withdraw'
import type { FC } from 'react'

import { ActionButton } from 'components/common'

export const WithdrawTradeButton: FC = () => {
  const withdraw = useWithdraw()
  // TODO consider transforming label into param for mapping
  const { disabled, label, handleTrade } = useHandleTrade(withdraw)

  return (
    <ActionButton onClick={handleTrade} disabled={disabled} highlighted>
      {label}
    </ActionButton>
  )
}
