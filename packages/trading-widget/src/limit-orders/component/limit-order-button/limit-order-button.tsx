import type { FC } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useLimitOrderButton } from 'limit-orders/component/limit-order-button/limit-order-button.hooks'

export const LimitOrderButton: FC = () => {
  const { modifyLimitOrder, disabled } = useLimitOrderButton()
  return (
    <ActionButton onClick={modifyLimitOrder} disabled={disabled}>
      Modify
    </ActionButton>
  )
}
