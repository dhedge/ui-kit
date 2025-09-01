import type { FC, PropsWithChildren } from 'react'

import type { ActionButtonProps } from 'trading-widget/components/common'
import { ActionButton } from 'trading-widget/components/common'
import { useOpenLimitSellsOverlay } from 'trading-widget/hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const LimitOrderButton: FC<PropsWithChildren<ActionButtonProps>> = ({
  children,
  ...props
}) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { openLimitSellOverlay, displayLimitSellOverlay } =
    useOpenLimitSellsOverlay()

  if (!displayLimitSellOverlay) {
    return null
  }

  return (
    <Button {...props} onClick={openLimitSellOverlay}>
      {children}
    </Button>
  )
}
