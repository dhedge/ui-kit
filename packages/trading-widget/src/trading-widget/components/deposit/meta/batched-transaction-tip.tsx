import type { FC } from 'react'

import { EIP5792_LINK } from 'core-kit/const'
import { useBatchedTransactionTip } from 'trading-widget/components/deposit/meta/batched-transaction-tip.hooks'
import { BatchTransactionsSwitch } from 'trading-widget/components/widget/widget-settings'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const BatchedTransactionTip: FC = () => {
  const { displayTip } = useBatchedTransactionTip()
  const t = useTranslationContext()

  if (!displayTip) {
    return null
  }

  return (
    <div className="dtw-flex dtw-items-center dtw-justify-between dtw-flex-nowrap dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)]">
      <div>
        <p className="dtw-text-md  dtw-text-[color:var(--panel-primary-content-color)]">
          {t.seamlessOneClickTrading}
        </p>
        <p className="dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
          Approve & deposit in a{' '}
          <a
            className="!dtw-text-[color:var(--panel-meta-link-color,var(--panel-content-color))]"
            href={EIP5792_LINK}
            target="_blank"
            rel="noreferrer"
          >
            single transaction
          </a>
          .
        </p>
      </div>
      <div className="dtw-flex-shrink-0">
        <BatchTransactionsSwitch />
      </div>
    </div>
  )
}
