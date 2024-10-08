import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'

import { WithdrawUnrollTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/unroll-step/meta/transaction-disclosure/transaction-disclosure'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const WithdrawUnrollMeta: FC<PropsWithChildren> = ({ children }) => {
  const { WithdrawMetaInfo } = useComponentContext()

  return (
    <Layout.Meta>
      <WithdrawUnrollTransactionOverviewDisclosure />
      {WithdrawMetaInfo && <WithdrawMetaInfo />}
      {children}
    </Layout.Meta>
  )
}
