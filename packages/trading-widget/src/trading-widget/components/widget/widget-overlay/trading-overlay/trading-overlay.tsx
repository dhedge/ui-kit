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
    <Layout.Overlay onClose={onClose}>
      <p className="dtw-mb-6 dtw-text-lg dtw-font-semibold dtw-drop-shadow-md">
        {title}
      </p>
      {isSuccessTx ? (
        <CheckCircleIcon className="dtw-h-16 dtw-w-16 dtw-text-success" />
      ) : (
        <LogoSpinner className="dtw-h-16 dtw-w-16" />
      )}
      <div className="dtw-mt-6 dtw-text-center dtw-font-light dtw-drop-shadow-md dtw-max-h-36 dtw-overflow-y-scroll dtw-break-all">
        <TradingSummary />
      </div>
      <div className="dtw-mt-6 dtw-w-full dempty:tw-mt-0 dtw-flex dtw-items-center dtw-justify-center">
        {link && (
          <ExternalLinkButton link={link}>{t.explorer}</ExternalLinkButton>
        )}
      </div>
    </Layout.Overlay>
  )
}
