import type { FC } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useLimitOrderDeleteButton } from 'limit-orders/component/limit-order-button/limit-order-delete-button.hooks'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'

export const LimitOrderDeleteButton: FC = () => {
  const t = useTranslationContext()
  const { deleteLimitOrder, isPending, displayButton } =
    useLimitOrderDeleteButton()

  if (!displayButton) {
    return null
  }

  return (
    <ActionButton
      highlighted={false}
      className="!dtw-py-1"
      onClick={deleteLimitOrder}
      loading={isPending}
    >
      {t.delete}
    </ActionButton>
  )
}
