import { CheckCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import {
  ExternalLinkButton,
  Layout,
  Spinner,
} from 'trading-widget/components/common'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import type { TradingOverlayProps } from './trading-overlay.hooks'
import { useTradingOverlay } from './trading-overlay.hooks'
import { TradingSummary } from './trading-summary/trading-summary'

export const TradingOverlay: FC<TradingOverlayProps> = ({ type }) => {
  const { link, title, onClose, isSuccessTx } = useTradingOverlay({ type })
  const { LogoSpinner = Spinner } = useComponentContext()
  const t = useTranslationContext()

  return (
    <Layout.Notification onClose={onClose}>
      <div className="dtw-flex dtw-items-center dtw-gap-1.5">
        <span className="dtw-font-semibold dtw-drop-shadow-md">{title}</span>
        {isSuccessTx ? (
          <CheckCircleIcon className="dtw-h-6 dtw-w-6 dtw-text-success" />
        ) : (
          <LogoSpinner className="dtw-h-5 dtw-w-5 " />
        )}
      </div>
      <div className="dtw-font-light dtw-text-sm dtw-max-h-12 dtw-overflow-y-scroll dtw-break-all">
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
    </Layout.Notification>
  )
}
