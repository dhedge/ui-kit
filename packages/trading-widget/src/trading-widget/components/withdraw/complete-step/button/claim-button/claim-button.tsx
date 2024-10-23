import type { FC } from 'react'

import type { ActionButtonProps } from 'trading-widget/components/common'
import { ActionButton } from 'trading-widget/components/common'
import { useClaimButton } from 'trading-widget/components/withdraw/complete-step/button/claim-button/claim-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const ClaimButton: FC<ActionButtonProps> = ({
  highlighted,
  className,
}) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()

  const { handleTrade, disabled, label, isWrongNetwork } = useClaimButton()

  if (isWrongNetwork) {
    return null
  }

  return (
    <Button
      onClick={handleTrade}
      disabled={disabled}
      highlighted={highlighted}
      className={className}
    >
      {label}
    </Button>
  )
}
