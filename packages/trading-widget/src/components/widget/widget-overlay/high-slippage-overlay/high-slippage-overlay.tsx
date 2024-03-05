import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import { ActionButton, Layout } from 'components/common'
import { useOverlayHandlers } from 'providers/overlay-provider'
import { useTranslationContext } from 'providers/translation-provider'
import type { OverlayProps } from 'types'

export const HighSlippageOverlay: FC<OverlayProps> = ({ type }) => {
  const t = useTranslationContext()

  const { handleReject, handleConfirm } = useOverlayHandlers({ type })

  return (
    <Layout.Overlay className="dtw-justify-between dtw-gap-y-1">
      <div className="dtw-flex dtw-gap-1 dtw-items-center dtw-text-warning">
        <ExclamationCircleIcon className="dtw-h-5 dtw-w-5" />
        <p>{t.highSlippage}</p>
      </div>
      <p className="dtw-text-sm">{t.responsibleHighSlippage}</p>
      <p className="dtw-text-sm dtw-self-start">{t.highSlippageListTitle}:</p>
      <ul className="dtw-list-inside dtw-list-disc dtw-flex dtw-flex-col dtw-gap-y-1 dtw-text-sm dtw-text-themeGray dtw-max-h-28 dtw-overflow-y-scroll">
        <li>{t.termOfUseDepositAssetSlippage}</li>
        <li>{t.termOfUseDepositBugs}</li>
        <li>{t.termOfUseDepositDowntime}</li>
        <li>{t.termOfUseDepositAuditRisk}</li>
      </ul>
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <ActionButton highlighted={false} onClick={handleReject}>
          {t.back}
        </ActionButton>
        <ActionButton onClick={handleConfirm}>{t.confirm}</ActionButton>
      </div>
    </Layout.Overlay>
  )
}
