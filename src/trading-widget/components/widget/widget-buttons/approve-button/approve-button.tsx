import type { FC } from 'react'

import { ActionButton } from 'trading-widget/components/common'
import type { ApproveButtonProps } from 'trading-widget/components/widget/widget-buttons/approve-button/approve-button.hooks'
import { useApproveButton } from 'trading-widget/components/widget/widget-buttons/approve-button/approve-button.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

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
