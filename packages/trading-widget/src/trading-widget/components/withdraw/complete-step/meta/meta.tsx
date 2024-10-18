import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'
import { CompleteWithdrawTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/complete-step/meta/transaction-disclosure/transaction-disclosure'

export const CompleteWithdrawMeta: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout.Meta>
      <CompleteWithdrawTransactionOverviewDisclosure />
      {children}
    </Layout.Meta>
  )
}
