import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common/layout'

import { useComponentContext } from 'trading-widget/providers/component-provider'

import { OpenLimitOrderAfterBuySwitch } from './open-limit-order-after-buy-switch/open-limit-order-after-buy-switch'

import { DepositTransactionOverviewDisclosure } from './transaction-disclosure/transaction-disclosure'

export const DepositMeta: FC<PropsWithChildren> = ({ children }) => {
  const { DepositMetaInfo } = useComponentContext()

  return (
    <Layout.Meta>
      <OpenLimitOrderAfterBuySwitch />
      <DepositTransactionOverviewDisclosure />
      {DepositMetaInfo && <DepositMetaInfo />}
      {children}
    </Layout.Meta>
  )
}
