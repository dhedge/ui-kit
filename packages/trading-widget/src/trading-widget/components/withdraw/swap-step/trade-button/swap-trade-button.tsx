import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useSwapTradeButton } from 'trading-widget/components/withdraw/swap-step/trade-button/swap-trade-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const SwapTradeButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { handleTrade, disabled, label } = useSwapTradeButton()

  return (
    <Button onClick={handleTrade} disabled={disabled}>
      {label}
    </Button>
  )
}
