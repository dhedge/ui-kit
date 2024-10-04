import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { UnrollStep } from 'trading-widget/components/withdraw/unroll-step/unroll-step'

import { useWithdrawTabPanel } from './tab-panel.hooks'

const WithdrawTab: FC = () => {
  const { isWithdrawUnrollStep } = useWithdrawTabPanel()
  return isWithdrawUnrollStep ? <UnrollStep /> : <>Swap Step</>
}

export const WithdrawTabPanel: FC = () => (
  <Layout.Panel>
    <WithdrawTab />
  </Layout.Panel>
)
