import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common/layout'

import { DepositTransactionOverviewDisclosure } from 'trading-widget/components/deposit/meta/transaction-disclosure/transaction-disclosure'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const DepositMeta: FC<PropsWithChildren> = ({ children }) => {
  const { DepositMetaInfo } = useComponentContext()

  return (
    <Layout.Meta>
      <DepositTransactionOverviewDisclosure />
      {DepositMetaInfo && <DepositMetaInfo />}
      <div className="dtw-sticky dtw-bottom-0 dtw-bg-[var(--panel-meta-action-panel-bg)]">
        {children}
      </div>
    </Layout.Meta>
  )
}
