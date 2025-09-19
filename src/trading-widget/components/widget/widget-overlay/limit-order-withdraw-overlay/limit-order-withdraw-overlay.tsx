import type { FC } from 'react'
import { useState } from 'react'

import { ActionButton, Layout } from 'trading-widget/components/common'

import { CheckBox } from 'trading-widget/components/common/checkbox/checkbox'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useOverlayHandlers } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import type { OverlayProps } from 'trading-widget/types'

import { LimitOrderWithdrawApproveButton } from './limit-order-withdraw-approve-button/limit-order-withdraw-approve-button'
import { LimitOrderWithdrawButton } from './limit-order-withdraw-button/limit-order-withdraw-button'
import { LimitOrderWithdrawTermsContent } from './limit-order-withdraw-terms-content'

export const LimitOrderWithdrawOverlay: FC<OverlayProps> = ({ type }) => {
  const t = useTranslationContext()
  const { ActionButton: Button = ActionButton } = useComponentContext()

  const { handleReject } = useOverlayHandlers({ type })

  const [termsAccepted, setTermsAccepted] = useState(false)

  return (
    <Layout.Overlay onClose={handleReject}>
      <div className="dtw-flex dtw-flex-col dtw-gap-2 dtw-w-full">
        <div className="dtw-px-2 dtw-flex dtw-flex-col dtw-gap-2">
          <LimitOrderWithdrawTermsContent />
          <div className="dtw-mt-1 dtw-flex dtw-items-center dtw-gap-1.5">
            <CheckBox
              checked={termsAccepted}
              onChange={(checked) => setTermsAccepted(checked)}
              label={t.termOfUseWithdrawAcceptLabel}
              labelClassName="dtw-text-sm dtw-cursor-pointer"
            />
          </div>
        </div>
        <Button highlighted={false} onClick={handleReject}>
          {t.back}
        </Button>
        <LimitOrderWithdrawApproveButton>
          <LimitOrderWithdrawButton disabled={!termsAccepted} />
        </LimitOrderWithdrawApproveButton>
      </div>
    </Layout.Overlay>
  )
}
