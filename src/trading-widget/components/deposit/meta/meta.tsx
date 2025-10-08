import type { FC, PropsWithChildren } from 'react'

import { useIsMaxSupplyCapReached } from 'core-kit/hooks/trading/deposit-v2/use-is-max-supply-cap-reached'
import { Layout } from 'trading-widget/components/common/layout'

import { DepositTransactionOverviewDisclosure } from 'trading-widget/components/deposit/meta/transaction-disclosure/transaction-disclosure'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const DepositMeta: FC<PropsWithChildren> = ({ children }) => {
  const { DepositMetaInfo, MaxSupplyReachedAlert } = useComponentContext()
  const { isMaxSupplyCapReached, supplyCapInUsd } = useIsMaxSupplyCapReached()

  return (
    <Layout.Meta>
      {isMaxSupplyCapReached && !!MaxSupplyReachedAlert && (
        <MaxSupplyReachedAlert supplyCapInUsd={supplyCapInUsd} />
      )}
      <DepositTransactionOverviewDisclosure />
      {DepositMetaInfo && <DepositMetaInfo />}
      <div className="dtw-sticky dtw-bottom-0 dtw-bg-[var(--panel-meta-action-panel-bg)]">
        {children}
      </div>
    </Layout.Meta>
  )
}
