import { useHandleTrade } from '@dhedge/core-ui-kit/hooks/trading'
import { useDeposit } from '@dhedge/core-ui-kit/hooks/trading/deposit'
import type { FC } from 'react'

import { ActionButton } from 'components/common'

export const DepositTradeButton: FC = () => {
  const deposit = useDeposit()
  // TODO consider transforming label into param for mapping
  const { disabled, label, handleTrade } = useHandleTrade(deposit)

  return (
    <ActionButton onClick={handleTrade} disabled={disabled} highlighted>
      {label}
    </ActionButton>
  )
}
