import type { FC } from 'react'

import { Layout } from 'components/common'
import { ValidNetworkButton } from 'components/widget/widget-buttons'

import { ValidWithdrawButton } from '../../button/valid-withdraw-button/valid-withdraw-button'

import { WithdrawMeta } from '../../meta/meta'

export const WithdrawTabPanel: FC = () => {
  return (
    <Layout.Panel>
      <WithdrawMeta>
        <ValidNetworkButton>
          <ValidWithdrawButton>Withdraw Trade</ValidWithdrawButton>
        </ValidNetworkButton>
      </WithdrawMeta>
    </Layout.Panel>
  )
}
