import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { CompleteStep } from 'trading-widget/components/withdraw/complete-step/complete-step'
import { InitStep } from 'trading-widget/components/withdraw/init-step/init-step'
import { useWithdrawTabPanel } from 'trading-widget/components/withdraw/tab-panel/tab-panel.hooks'

export const WithdrawTabPanel: FC = () => {
  const { isCompleteWithdrawStep } = useWithdrawTabPanel()

  return (
    <Layout.Panel>
      {isCompleteWithdrawStep ? <CompleteStep /> : <InitStep />}
    </Layout.Panel>
  )
}
