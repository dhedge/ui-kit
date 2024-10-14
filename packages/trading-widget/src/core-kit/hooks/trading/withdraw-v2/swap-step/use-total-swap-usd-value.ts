import { useWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/swap-step'

export const useTotalSwapUsdValue = (): number => {
  const { data: assets = [] } = useWithdrawTrackedAssets()

  return assets.reduce((acc, { balance, price }) => acc + balance * price, 0)
}