import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { Stepper } from 'trading-widget/components/widget/widget-meta/stepper'
import { CompleteStep } from 'trading-widget/components/withdraw/complete-step/complete-step'
import { InitStep } from 'trading-widget/components/withdraw/init-step/init-step'
import { useWithdrawTabPanel } from 'trading-widget/components/withdraw/tab-panel/tab-panel.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const WithdrawTabPanel: FC = () => {
  const t = useTranslationContext()
  const { isCompleteWithdrawStep, isMultiAssetWithdraw, isStep1Active } =
    useWithdrawTabPanel()

  return (
    <Layout.Panel>
      {isCompleteWithdrawStep ? <CompleteStep /> : <InitStep />}
      {!isMultiAssetWithdraw && (
        <Stepper
          step1={t.unrollAction}
          step2={t.swapAction}
          isStep1Active={isStep1Active}
          className="dtw-mt-1"
        />
      )}
    </Layout.Panel>
  )
}
