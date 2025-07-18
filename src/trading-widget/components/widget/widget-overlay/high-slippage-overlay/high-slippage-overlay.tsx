import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import { ActionButton, Layout } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import type { OverlayProps } from 'trading-widget/types'

export const HighSlippageOverlay: FC<OverlayProps> = ({ type }) => {
  const t = useTranslationContext()
  const { ActionButton: Button = ActionButton } = useComponentContext()

  const { handleReject, handleConfirm } = useOverlayHandlers({ type })

  return (
    <Layout.Overlay className="dtw-justify-between dtw-gap-y-1">
      <div className="dtw-flex dtw-gap-1 dtw-items-center dtw-text-warning">
        <ExclamationCircleIcon className="dtw-h-5 dtw-w-5" />
        <p>{t.highSlippage}</p>
      </div>
      <p className="dtw-text-sm">{t.responsibleHighSlippage}</p>
      <p className="dtw-text-sm dtw-self-start">{t.highSlippageListTitle}:</p>
      <ul className="dtw-list-inside dtw-list-disc dtw-flex dtw-flex-col dtw-gap-y-1 dtw-text-sm dtw-text-[color:var(--panel-secondary-content-color)] dtw-max-h-28 dtw-overflow-y-auto theme-scrollbar">
        <li>{t.termOfUseDepositAssetSlippage}</li>
        <li>{t.termOfUseDepositBugs}</li>
        <li>{t.termOfUseDepositDowntime}</li>
        <li>{t.termOfUseDepositAuditRisk}</li>
      </ul>
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <Button highlighted={false} onClick={handleReject}>
          {t.back}
        </Button>
        <Button onClick={handleConfirm}>{t.confirm}</Button>
      </div>
    </Layout.Overlay>
  )
}
