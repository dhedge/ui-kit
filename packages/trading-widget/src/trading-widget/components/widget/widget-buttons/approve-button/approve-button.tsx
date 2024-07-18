import type { FC } from 'react'

import { ActionButton, Spinner } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import { THEME_TYPE } from 'trading-widget/types'

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
    <Button disabled={disabled} onClick={onApprove}>
      <div className="dtw-flex dtw-items-center dtw-justify-center dtw-gap-1">
        <span>
          {t.approve} {symbol}
        </span>
        {isLoading && (
          <Spinner type={THEME_TYPE.DEFAULT} className="dtw-h-4 dtw-w-4" />
        )}
      </div>
    </Button>
  )
}
