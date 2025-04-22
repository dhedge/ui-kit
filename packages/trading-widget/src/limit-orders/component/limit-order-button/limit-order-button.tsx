import type { FC } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useLimitOrderButton } from 'limit-orders/component/limit-order-button/limit-order-button.hooks'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'

export const LimitOrderButton: FC = () => {
  const t = useTranslationContext()
  const { modifyLimitOrder, disabled, error, isPending } = useLimitOrderButton()
  return (
    <div>
      {error && (
        <div className="dtw-mb-2 dtw-flex dtw-flex-col dtw-gap-1 dtw-text-error">
          <span className="dtw-text-sm">{error.title}</span>
          {error.hint && <span className="dtw-text-xs">{error.hint}</span>}
        </div>
      )}
      <ActionButton
        onClick={modifyLimitOrder}
        disabled={disabled}
        loading={isPending}
      >
        {t.modify}
      </ActionButton>
    </div>
  )
}
