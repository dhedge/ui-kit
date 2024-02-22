import type { FC } from 'react'

import { Layout } from 'components/common'

import { WithdrawMeta } from '../../meta/meta'

export const WithdrawTabPanel: FC = () => {
  return (
    <Layout.Panel>
      <WithdrawMeta>Withdraw Action Buttons</WithdrawMeta>
    </Layout.Panel>
  )
}
