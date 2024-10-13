import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'
import { useClaimButton } from 'trading-widget/components/withdraw/swap-step/balance/claim-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const ClaimButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()

  const { handleTrade, disabled, label } = useClaimButton()

  return (
    <Button
      onClick={handleTrade}
      disabled={disabled}
      highlighted={false}
      className="dtw-py-0.5 dtw-px-1 dtw-text-[length:var(--panel-input-button-font-size,var(--panel-font-size-xs))]"
    >
      {label}
    </Button>
  )
}
