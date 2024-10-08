import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'
import { WithdrawSwapTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/swap-step/meta/transaction-disclosure/transaction-disclosure'

export const WithdrawSwapMeta: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout.Meta>
      <WithdrawSwapTransactionOverviewDisclosure />
      {children}
    </Layout.Meta>
  )
}
