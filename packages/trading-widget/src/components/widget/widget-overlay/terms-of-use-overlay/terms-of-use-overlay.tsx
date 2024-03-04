import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import { ActionButton, Layout } from 'components/common'
import { useComponentContext } from 'providers/component-provider'
import { useTranslationContext } from 'providers/translation-provider'
import type { OverlayProps } from 'types'

import { useTermsOfUseOverlay } from './terms-of-use-overlay.hooks'

export const TermsOfUseOverlay: FC<OverlayProps> = ({ type }) => {
  const t = useTranslationContext()
  const { DepositTermsOfUse } = useComponentContext()

  const { handleReject, handleConfirm } = useTermsOfUseOverlay({ type })

  return (
    <Layout.Overlay className="dtw-flex-col dtw-justify-between">
      <div className="dtw-flex dtw-gap-1 dtw-items-center">
        <ExclamationCircleIcon className="dtw-h-5 dtw-w-5" />
        <p>{t.termOfUseDepositTitle}:</p>
      </div>
      <div className="dtw-pl-4">
        <ul className="dtw-my-4 dtw-list-disc dtw-flex dtw-flex-col dtw-gap-y-1 dtw-text-sm">
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
