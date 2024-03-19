import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'

import { useComponentContext } from 'trading-widget/providers/component-provider'

import { WithdrawTransactionOverviewDisclosure } from './transaction-disclosure/transaction-disclosure'

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
