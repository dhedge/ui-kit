import type { FC, PropsWithChildren } from 'react'

import { Layout } from 'trading-widget/components/common'

import { InitWithdrawTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/init-step/meta/transaction-disclosure/transaction-disclosure'
import { useLeveragedWithdrawalChecks } from 'trading-widget/hooks/use-leveraged-withdrawal-checks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const InitWithdrawMeta: FC<PropsWithChildren> = ({ children }) => {
  const { WithdrawMetaInfo, AvailableLiquidityAlert } = useComponentContext()
  const {
    requiresLeveragedCollateralLiquidity,
    leveragedCollateralValueFormatted,
  } = useLeveragedWithdrawalChecks()

  return (
    <Layout.Meta>
      {requiresLeveragedCollateralLiquidity && !!AvailableLiquidityAlert && (
        <AvailableLiquidityAlert
          liquidityAmount={leveragedCollateralValueFormatted}
        />
      )}
      <InitWithdrawTransactionOverviewDisclosure />
      {WithdrawMetaInfo && <WithdrawMetaInfo />}
      <div className="dtw-mt-auto dtw-mb-0">{children}</div>
    </Layout.Meta>
  )
}
