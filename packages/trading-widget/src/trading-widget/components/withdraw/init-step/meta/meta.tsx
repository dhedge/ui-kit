import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'

import { InitWithdrawTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/init-step/meta/transaction-disclosure/transaction-disclosure'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const InitWithdrawMeta: FC<PropsWithChildren> = ({ children }) => {
  const { WithdrawMetaInfo } = useComponentContext()

  return (
    <Layout.Meta>
      <InitWithdrawTransactionOverviewDisclosure />
      {WithdrawMetaInfo && <WithdrawMetaInfo />}
      {children}
    </Layout.Meta>
  )
}
