import type { FC } from 'react'

import { Alert, TokenIcon } from 'trading-widget/components/common'
import { useLimitOrderWithdrawalAlert } from 'trading-widget/components/widget/widget-meta/limit-order-withdrawal-alert/limit-order-withdrwal-alert.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface LimitOrderWithdrawAlertProps {
  className?: string
}

export const LimitOrderWithdrawAlert: FC<LimitOrderWithdrawAlertProps> = ({
  className,
}) => {
  const t = useTranslationContext()
  const {
    hasPendingLimitOrderWithdraw,
    pendingLimitOrderWithdrawAmount,
    symbol,
    handleLimitOrderWithdraw,
    label,
  } = useLimitOrderWithdrawalAlert()

  if (!hasPendingLimitOrderWithdraw) {
    return null
  }

  return (
    <Alert type="info" className={className}>
      <div className="dtw-flex dtw-justify-between">
        <div>
          <p>{t.pendingWithdrawalRequest}</p>
          <p className="dtw-text-sm dtw-text-[color:var(--panel-secondary-content-color)] dtw-flex dtw-gap-1">
            {pendingLimitOrderWithdrawAmount} <TokenIcon symbols={[symbol]} />{' '}
            {symbol}
          </p>
        </div>
        <button
          className="dtw-cursor-pointer !dtw-text-[color:var(--panel-input-button-content-color,var(--panel-content-color))] dtw-px-[var(--panel-input-button-px)] dtw-leading-[var(--panel-input-button-line-height,var(--panel-line-height-xs))] hover:dtw-opacity-[var(--panel-action-hover-opacity)] dtw-opacity-[var(--panel-action-opacity)]"
          onClick={handleLimitOrderWithdraw}
        >
          {label}
        </button>
      </div>
    </Alert>
  )
}
