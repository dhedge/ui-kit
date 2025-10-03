import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useComponentContext } from 'trading-widget/providers/component-provider'

import { useLimitOrderWithdrawButton } from './limit-order-withdraw-button.hooks'

interface Props {
  disabled?: boolean
}

export const LimitOrderWithdrawButton: FC<Props> = ({ disabled }) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { label, handleLimitOrderWithdraw, isLoading } =
    useLimitOrderWithdrawButton()

  return (
    <Button
      onClick={handleLimitOrderWithdraw}
      disabled={disabled}
      loading={isLoading}
    >
      {label}
    </Button>
  )
}
