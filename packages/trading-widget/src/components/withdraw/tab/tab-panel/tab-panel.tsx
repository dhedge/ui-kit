import type { FC } from 'react'

import { Layout } from 'components/common'
import { ValidNetworkButton } from 'components/widget/widget-buttons'

import { WithdrawTradeButton } from '../../button/trade-button/trade-button'
import { ValidWithdrawButton } from '../../button/valid-withdraw-button/valid-withdraw-button'

import { WithdrawMeta } from '../../meta/meta'

export const WithdrawTabPanel: FC = () => (
  <Layout.Panel>
    <WithdrawMeta>
      <ValidNetworkButton>
        <ValidWithdrawButton>
          <WithdrawTradeButton />
        </ValidWithdrawButton>
      </ValidNetworkButton>
    </WithdrawMeta>
  </Layout.Panel>
)
