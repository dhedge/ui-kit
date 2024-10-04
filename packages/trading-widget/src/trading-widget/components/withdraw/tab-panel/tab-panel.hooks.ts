import { useWithdrawV2TrackedAssets } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-v2-tracked-assets'

export const useWithdrawTabPanel = () => {
  const { data: assets = [] } = useWithdrawV2TrackedAssets()

  return {
    isWithdrawUnrollStep: assets.length === 0,
  }
}
