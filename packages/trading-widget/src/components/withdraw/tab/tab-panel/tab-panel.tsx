import type { FC } from 'react'

import { TabPanel } from 'components/common'

import { WithdrawMeta } from '../../meta/meta'

export const WithdrawTabPanel: FC = () => {
  return (
    <TabPanel>
      <WithdrawMeta>Withdraw Action Buttons</WithdrawMeta>
    </TabPanel>
  )
}
