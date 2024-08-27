import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import type { ApproveButtonProps } from './approve-button.hooks'
import { useApproveButton } from './approve-button.hooks'

export const ApproveButton: FC<ApproveButtonProps> = ({
  onApprove,
  symbol,
}) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const t = useTranslationContext()
  const { disabled, isLoading } = useApproveButton()

  return (
    <Button disabled={disabled} onClick={onApprove} loading={isLoading}>
      <span>
        {t.approve} {symbol}
      </span>
    </Button>
  )
}
