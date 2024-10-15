import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { CompleteStep } from 'trading-widget/components/withdraw/complete-step/complete-step'
import { InitStep } from 'trading-widget/components/withdraw/init-step/init-step'

import { useWithdrawTabPanel } from './tab-panel.hooks'

const WithdrawTab: FC = () => {
  const { isCompleteWithdrawStep } = useWithdrawTabPanel()
  return isCompleteWithdrawStep ? <InitStep /> : <CompleteStep />
}

export const WithdrawTabPanel: FC = () => (
  <Layout.Panel>
    <WithdrawTab />
  </Layout.Panel>
)
