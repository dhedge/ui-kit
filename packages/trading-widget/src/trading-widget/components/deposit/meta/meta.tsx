import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common/layout'

import { useComponentContext } from 'trading-widget/providers/component-provider'

import { DepositTransactionOverviewDisclosure } from './transaction-disclosure/transaction-disclosure'

export const DepositMeta: FC<PropsWithChildren> = ({ children }) => {
  const { DepositMetaInfo } = useComponentContext()

  return (
    <Layout.Meta>
      <DepositTransactionOverviewDisclosure />
      {DepositMetaInfo && <DepositMetaInfo />}
      {children}
    </Layout.Meta>
  )
}
