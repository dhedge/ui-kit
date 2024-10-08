import { useTrackedAssets } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-tracked-assets'

export const useIsWithdrawV2SwapStep = () => {
  const { data: assets = [] } = useTrackedAssets()
  return assets?.length > 0
}
