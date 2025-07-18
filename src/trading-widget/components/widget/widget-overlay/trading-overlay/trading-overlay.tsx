import { CheckCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import {
  ExternalLinkButton,
  Layout,
  Spinner,
} from 'trading-widget/components/common'

import { SuccessDepositOverlay } from 'trading-widget/components/widget/widget-overlay/trading-overlay/deposits/success-deposit-overlay'
import { LimitOrderTransactionOverlay } from 'trading-widget/components/widget/widget-overlay/trading-overlay/limit-order/limit-order-transaction-overlay'

import type { TradingOverlayProps } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-overlay.hooks'
import { useTradingOverlay } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-overlay.hooks'
import { TradingSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/trading-summary'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const TradingOverlay: FC<TradingOverlayProps> = ({ type }) => {
  const {
    link,
    title,
    onClose,
    isSuccessTx,
    showNextStepTip,
    displaySuccessDepositOverlay,
    displayLimitOrderTransactionOverlay,
  } = useTradingOverlay({ type })
  const { LogoSpinner = Spinner } = useComponentContext()
  const t = useTranslationContext()

  if (displayLimitOrderTransactionOverlay) {
    return <LimitOrderTransactionOverlay type={type} />
  }

  if (displaySuccessDepositOverlay) {
    return <SuccessDepositOverlay type={type} />
  }

  return (
    <Layout.Notification onClose={onClose}>
      <div className="dtw-flex dtw-items-center dtw-gap-1.5">
        <span className="dtw-font-semibold dtw-drop-shadow-md">{title}</span>
        {isSuccessTx ? (
          <CheckCircleIcon className="dtw-h-6 dtw-w-6 dtw-text-[color:var(--panel-success-content-color)]" />
        ) : (
          <LogoSpinner className="dtw-h-5 dtw-w-5 " />
        )}
      </div>
      <div className="dtw-font-light dtw-text-sm dtw-max-h-16 dtw-overflow-y-auto theme-scrollbar dtw-break-all">
        <TradingSummary />
      </div>
      {link && (
        <ExternalLinkButton
          link={link}
          className="dtw-text-sm"
          iconClassName="dtw-w-4 dtw-h-4"
        >
          {t.explorer}
        </ExternalLinkButton>
      )}
      {showNextStepTip && (
        <p className="dtw-text-xs">{t.proceedWithNextStep}</p>
      )}
    </Layout.Notification>
  )
}
