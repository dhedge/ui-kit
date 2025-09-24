import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'
import { CompleteWithdrawTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/complete-step/meta/transaction-disclosure/transaction-disclosure'

export const CompleteWithdrawMeta: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout.Meta>
      <CompleteWithdrawTransactionOverviewDisclosure />
      <div className="dtw-sticky dtw-bottom-0 dtw-bg-[var(--panel-meta-action-panel-bg)]">
        {children}
      </div>
    </Layout.Meta>
  )
}
