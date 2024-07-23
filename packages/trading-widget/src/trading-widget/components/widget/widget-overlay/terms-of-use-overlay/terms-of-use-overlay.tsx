import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'

import { ActionButton, Layout, Spinner } from 'trading-widget/components/common'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import type { OverlayProps } from 'trading-widget/types'

export const TermsOfUseOverlay: FC<OverlayProps> = ({ type }) => {
  const t = useTranslationContext()
  const { DepositTermsOfUse, ActionButton: Button = ActionButton } =
    useComponentContext()

  const { handleReject, handleConfirm, isPending } = useOverlayHandlers({
    type,
  })

  return (
    <Layout.Overlay className="dtw-justify-between dtw-gap-y-1 dtw-overflow-y-auto">
      <div className="dtw-flex dtw-gap-1 dtw-items-center dtw-text-warning">
        <ExclamationCircleIcon className="dtw-h-5 dtw-w-5" />
        <p>{t.termsOfUse}</p>
      </div>
      <div className="dtw-flex dtw-flex-col dtw-gap-2">
        <p className="dtw-self-start dtw-text-sm">
          {t.termOfUseDepositListTitle}:
        </p>
        <ul className="dtw-list-inside dtw-list-disc dtw-flex dtw-flex-col dtw-gap-y-1 dtw-text-sm dtw-text-[color:var(--panel-secondary-content-color)]">
          <li>{t.termOfUseDepositAssetSlippage}</li>
          <li>{t.termOfUseDepositBugs}</li>
          <li>{t.termOfUseDepositDowntime}</li>
          <li>{t.termOfUseDepositAuditRisk}</li>
        </ul>
        {DepositTermsOfUse && <DepositTermsOfUse />}
      </div>
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <Button highlighted={false} onClick={handleReject}>
          {t.back}
        </Button>
        <Button onClick={handleConfirm} disabled={isPending}>
          <div className="dtw-flex dtw-items-center dtw-justify-center dtw-gap-1">
            <span>
              {isPending ? t.confirmInWallet : t.termOfUseDepositAccept}
            </span>
            {isPending && <Spinner className="dtw-h-4 dtw-w-4" />}
          </div>
        </Button>
      </div>
    </Layout.Overlay>
  )
}
