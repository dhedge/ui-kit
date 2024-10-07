import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'

import { SwapStep } from 'trading-widget/components/withdraw/swap-step/swap-step'
import { UnrollStep } from 'trading-widget/components/withdraw/unroll-step/unroll-step'

import { useWithdrawTabPanel } from './tab-panel.hooks'

const WithdrawTab: FC = () => {
  const { isWithdrawUnrollStep } = useWithdrawTabPanel()
  return isWithdrawUnrollStep ? <UnrollStep /> : <SwapStep />
}

export const WithdrawTabPanel: FC = () => (
  <Layout.Panel>
    <WithdrawTab />
  </Layout.Panel>
)
