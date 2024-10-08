import { useTrackedAssets } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-tracked-assets'

export const useSwappedUsdValue = (): number => {
  const { data: assets = [] } = useTrackedAssets()

  return assets.reduce((acc, { balance, price }) => acc + balance * price, 0)
}
