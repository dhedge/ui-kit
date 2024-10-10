import { useWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw/swap-step'

export const useIsWithdrawSwapStep = () => {
  const { data: assets = [] } = useWithdrawTrackedAssets()
  return assets?.length > 0
}
