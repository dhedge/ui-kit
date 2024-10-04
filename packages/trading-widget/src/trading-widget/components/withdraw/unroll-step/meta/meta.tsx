import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'

import { WithdrawTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/unroll-step/meta/transaction-disclosure/transaction-disclosure'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const WithdrawMeta: FC<PropsWithChildren> = ({ children }) => {
  const { WithdrawMetaInfo } = useComponentContext()

  return (
    <Layout.Meta>
      <WithdrawTransactionOverviewDisclosure />
      {WithdrawMetaInfo && <WithdrawMetaInfo />}
      {children}
    </Layout.Meta>
  )
}
