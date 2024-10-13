import { useWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/swap-step/use-withdraw-tracked-assets'

export const useIsWithdrawSwapStep = () => {
  const { data: assets = [] } = useWithdrawTrackedAssets()
  return assets?.length > 0
}
