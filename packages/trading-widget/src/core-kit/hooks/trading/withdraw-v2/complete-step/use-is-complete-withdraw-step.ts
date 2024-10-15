import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-tracked-assets'

export const useIsCompleteWithdrawStep = () => {
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  return assets?.length > 0
}
