import { CheckIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'

import { formatNumberToLimitedDecimals } from 'core-kit/utils'
import {
  ActionButton,
  Divider,
  ExternalLinkButton,
  Layout,
} from 'trading-widget/components/common'
import { useSuccessDepositOverlay } from 'trading-widget/components/widget/widget-overlay/trading-overlay/deposits/success-deposit-overlay.hooks'
import { useOpenLimitSellsOverlay } from 'trading-widget/hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import type { OverlayProps } from 'trading-widget/types'

export const SuccessDepositOverlay: FC<OverlayProps> = (props) => {
  const t = useTranslationContext()
  const { link, onClose, vaultSymbol, paidToken, txHash, vaultTokenPrice } =
    useSuccessDepositOverlay(props)
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const { openLimitSellOverlay, displayLimitSellOverlay } =
    useOpenLimitSellsOverlay()

  return (
    <Layout.Overlay className="dtw-justify-between dtw-gap-y-4" noPadding>
      <div className="dtw-flex dtw-flex-col dtw-items-center dtw-justify-center dtw-gap-2 dtw-pt-1 dtw-px-4 dtw-w-full">
        <div className="dtw-text-[color:var(--panel-success-content-color)] dtw-mb-2">
          <CheckIcon className="dtw-h-16 dtw-w-16 lg:dtw-h-24 lg:dtw-w-24 dtw-shrink-0" />
          Success
        </div>
        <Divider />
        <div className="dtw-flex dtw-items-center dtw-justify-between dtw-gap-2 dtw-w-full">
          <p>{t.orderingLabel}</p>
          <p className="dtw-text-[color:var(--panel-secondary-content-color)]">
            {vaultSymbol}
          </p>
        </div>
        <Divider />
        {paidToken && (
          <>
            <div className="dtw-flex dtw-items-center dtw-justify-between dtw-gap-2 dtw-w-full">
              <p>{t.paidLabel}</p>
              <div className="dtw-flex dtw-flex-col dtw-items-end dtw-justify-center dtw-gap-1 dtw-text-[color:var(--panel-secondary-content-color)]">
                {paidToken.value
                  ? formatNumberToLimitedDecimals(+paidToken.value, 4)
                  : null}{' '}
                {paidToken.symbol}
              </div>
            </div>
            <Divider />
          </>
        )}
        <div className="dtw-flex dtw-items-center dtw-justify-between dtw-gap-2 dtw-w-full">
          <p>{t.priceLabel}</p>
          <p className="dtw-text-[color:var(--panel-secondary-content-color)]">
            {vaultTokenPrice}
          </p>
        </div>
        {link && (
          <>
            <Divider />
            <div className="dtw-flex dtw-items-center dtw-justify-between dtw-gap-2 dtw-w-full">
              <p>{t.transactionLabel}</p>
              <ExternalLinkButton link={link}>
                {txHash ?? t.explorer}
              </ExternalLinkButton>
            </div>
          </>
        )}
      </div>

      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        {displayLimitSellOverlay && (
          <Button onClick={openLimitSellOverlay}>
            {t.openLimitOrderAfterBuySwitchLabel}
          </Button>
        )}
        <Button highlighted={false} onClick={onClose}>
          {t.done}
        </Button>
      </div>
    </Layout.Overlay>
  )
}
