import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useIsDhedgeVaultConnected } from 'core-kit/hooks/user'
import { useLeveragedWithdrawalChecks } from 'trading-widget/hooks/use-leveraged-withdrawal-checks'

export const useIsLimitOrderWithdraw = () => {
  const { pricingAsset, onDemandWithdrawalEnabled } =
    useTradingPanelPoolConfig()
  const { requiresLeveragedCollateralLiquidity } =
    useLeveragedWithdrawalChecks()
  const isVaultConnected = useIsDhedgeVaultConnected()

  return (
    requiresLeveragedCollateralLiquidity &&
    !!pricingAsset &&
    !!onDemandWithdrawalEnabled &&
    !isVaultConnected
  )
}
