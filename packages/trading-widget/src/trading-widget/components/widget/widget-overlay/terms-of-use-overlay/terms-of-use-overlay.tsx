import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import { ActionButton, Layout } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import type { OverlayProps } from 'trading-widget/types'

export const TermsOfUseOverlay: FC<OverlayProps> = ({ type }) => {
  const t = useTranslationContext()
  const { DepositTermsOfUse } = useComponentContext()

  const { handleReject, handleConfirm } = useOverlayHandlers({ type })

  return (
    <Layout.Overlay className="dtw-justify-between dtw-gap-y-1">
      <div className="dtw-flex dtw-gap-1 dtw-items-center dtw-text-warning">
        <ExclamationCircleIcon className="dtw-h-5 dtw-w-5" />
        <p>{t.termsOfUse}</p>
      </div>
      <div>
        <p className="dtw-self-start dtw-text-sm dtw-mb-1">
          {t.termOfUseDepositListTitle}:
        </p>
        <ul className="dtw-list-inside dtw-list-disc dtw-flex dtw-flex-col dtw-gap-y-1 dtw-text-sm dtw-text-themeGray">
          <li>{t.termOfUseDepositAssetSlippage}</li>
          <li>{t.termOfUseDepositBugs}</li>
          <li>{t.termOfUseDepositDowntime}</li>
          <li>{t.termOfUseDepositAuditRisk}</li>
          {DepositTermsOfUse && <DepositTermsOfUse />}
        </ul>
      </div>
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <ActionButton highlighted={false} onClick={handleReject}>
          {t.back}
        </ActionButton>
        <ActionButton onClick={handleConfirm}>
          {t.termOfUseDepositAccept}
        </ActionButton>
      </div>
    </Layout.Overlay>
  )
}
