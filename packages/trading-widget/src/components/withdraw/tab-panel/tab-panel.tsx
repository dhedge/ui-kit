import type { FC } from 'react'

import { Layout } from 'components/common'
import { ValidNetworkButton } from 'components/widget/widget-buttons'

import { useWithdrawTabPanel } from './tab-panel.hooks'
import { WithdrawBalance } from '../balance/balance'
import { WithdrawTradeButton } from '../button/trade-button/trade-button'
import { ValidWithdrawButton } from '../button/valid-withdraw-button/valid-withdraw-button'

import { WithdrawInputGroup } from '../input-group/input-group'
import { WithdrawMeta } from '../meta/meta'

export const WithdrawTabPanel: FC = () => {
  useWithdrawTabPanel()
  return (
    <Layout.Panel>
      <Layout.Balance>
        <WithdrawBalance />
      </Layout.Balance>
      <Layout.InputGroup>
        <WithdrawInputGroup />
      </Layout.InputGroup>
      <WithdrawMeta>
        <ValidNetworkButton>
          <ValidWithdrawButton>
            <WithdrawTradeButton />
          </ValidWithdrawButton>
        </ValidNetworkButton>
      </WithdrawMeta>
    </Layout.Panel>
  )
}
