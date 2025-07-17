import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useSwapButton } from 'trading-widget/components/withdraw/complete-step/button/swap-button/swap-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const SwapButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleClick, disabled, label, isLoading } = useSwapButton()

  return (
    <Button onClick={handleClick} disabled={disabled} loading={isLoading}>
      {label}
    </Button>
  )
}
