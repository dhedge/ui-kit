import type { FC } from 'react'

import { ActionButton } from 'limit-orders/component/common/action-button'
import { useLimitOrderButton } from 'limit-orders/component/limit-order-button/limit-order-button.hooks'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'

export const LimitOrderButton: FC = () => {
  const t = useTranslationContext()
  const {
    modifyLimitOrder,
    disabled,
    error,
    isPending,
    minAmount,
    isAmountSufficient,
    isModifyTransaction,
  } = useLimitOrderButton()

  return (
    <div>
      {error && (
        <div className="dtw-mb-2 dtw-flex dtw-flex-col dtw-gap-1 dtw-text-error">
          <span className="dtw-text-sm">{error.title}</span>
          {error.hint && <span className="dtw-text-xs">{error.hint}</span>}
        </div>
      )}
      {!isAmountSufficient && (
        <div className="dtw-mb-1 dtw-text-warning dtw-text-sm">
          {t.minimumVaultBalanceRequired.replace('{amount}', minAmount)}
        </div>
      )}
      <ActionButton
        onClick={modifyLimitOrder}
        disabled={disabled}
        loading={isPending}
      >
        {isModifyTransaction ? t.modify : t.create}
      </ActionButton>
    </div>
  )
}
