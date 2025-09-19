import type { FC, PropsWithChildren } from 'react'

import { useIsLimitOrderWithdraw } from 'core-kit/hooks/trading/limit-order-withdraw/use-is-limit-order-withdraw'
import { Layout } from 'trading-widget/components/common'

import { LimitOrderWithdrawAlert } from 'trading-widget/components/widget/widget-meta'
import { InitWithdrawTransactionOverviewDisclosure } from 'trading-widget/components/withdraw/init-step/meta/transaction-disclosure/transaction-disclosure'
import { useLeveragedWithdrawalChecks } from 'trading-widget/hooks/use-leveraged-withdrawal-checks'
import { useComponentContext } from 'trading-widget/providers/component-provider'

export const InitWithdrawMeta: FC<PropsWithChildren> = ({ children }) => {
  const { WithdrawMetaInfo, AvailableLiquidityAlert, OnDemandWithdrawAlert } =
    useComponentContext()
  const {
    requiresLeveragedCollateralLiquidity,
    leveragedCollateralValueFormatted,
  } = useLeveragedWithdrawalChecks()
  const isLimitOrderWithdraw = useIsLimitOrderWithdraw()

  return (
    <Layout.Meta>
      <div>
        <LimitOrderWithdrawAlert className="dtw-mb-2" />
        {!requiresLeveragedCollateralLiquidity ? null : isLimitOrderWithdraw ? (
          <>{!!OnDemandWithdrawAlert && <OnDemandWithdrawAlert />}</>
        ) : (
          <>
            {!!AvailableLiquidityAlert && (
              <AvailableLiquidityAlert
                liquidityAmount={leveragedCollateralValueFormatted}
              />
            )}
          </>
        )}
      </div>
      <InitWithdrawTransactionOverviewDisclosure />
      {WithdrawMetaInfo && <WithdrawMetaInfo />}
      <div className="dtw-sticky dtw-bottom-0 dtw-bg-[var(--panel-meta-action-panel-bg)]">
        {children}
      </div>
    </Layout.Meta>
  )
}
