import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
// import { useLeveragedWithdrawalChecks } from 'trading-widget/hooks/use-leveraged-withdrawal-checks'

export const useIsLimitOrderWithdraw = () => {
  const [sendToken] = useSendTokenInput()
  const { pricingAsset, onDemandWithdrawalEnabled } =
    useTradingPanelPoolConfig()
  // const { requiresLeveragedCollateralLiquidity } =
  //   useLeveragedWithdrawalChecks()
  //

  return !!sendToken.value && !!pricingAsset && !!onDemandWithdrawalEnabled
}
