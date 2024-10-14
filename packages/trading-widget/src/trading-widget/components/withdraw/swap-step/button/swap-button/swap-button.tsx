import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useSwapButton } from 'trading-widget/components/withdraw/swap-step/button/swap-button/swap-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const SwapButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleTrade, disabled, label } = useSwapButton()

  return (
    <Button onClick={handleTrade} disabled={disabled}>
      {label}
    </Button>
  )
}
