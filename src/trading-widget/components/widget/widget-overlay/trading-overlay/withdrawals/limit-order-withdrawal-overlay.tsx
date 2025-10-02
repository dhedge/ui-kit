import { CheckIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'

import {
  ActionButton,
  ExternalLinkButton,
  Layout,
} from 'trading-widget/components/common'
import { useLimitOrderWithdrawalOverlay } from 'trading-widget/components/widget/widget-overlay/trading-overlay/withdrawals/limit-order-withdrawal-overlay.hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import type { OverlayProps } from 'trading-widget/types'

export const LimitOrderWithdrawalOverlay: FC<OverlayProps> = (props) => {
  const t = useTranslationContext()
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { onClose, link } = useLimitOrderWithdrawalOverlay(props)
  return (
    <Layout.Overlay
      className="dtw-justify-between dtw-gap-y-4"
      onClose={onClose}
      noPadding
    >
      <div className="dtw-flex dtw-flex-col dtw-items-center dtw-justify-center dtw-gap-3 dtw-pt-1 dtw-px-4 dtw-w-full dtw-h-full">
        <CheckIcon className="dtw-h-16 dtw-w-16 lg:dtw-h-24 lg:dtw-w-24 dtw-shrink-0 dtw-text-[color:var(--panel-success-content-color)]" />
        <div className="dtw-text-center dtw-text-2xl dtw-font-semibold">
          {t.withdrawalRequest}
        </div>
        <div className="dtw-text-center dtw-text-[color:var(--panel-secondary-content-color)]">
          {t.expectToReceiveUsdcSoon}
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
      </div>
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <Button highlighted={false} onClick={onClose}>
          {t.done}
        </Button>
      </div>
    </Layout.Overlay>
  )
}
