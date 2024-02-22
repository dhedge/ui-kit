import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'components/common/layout'

import { useComponentContext } from 'providers/component-provider'

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
