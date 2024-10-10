import { useWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw/swap-step'

export const useWithdrawSwapUsdValue = (): number => {
  const { data: assets = [] } = useWithdrawTrackedAssets()

  return assets.reduce((acc, { balance, price }) => acc + balance * price, 0)
}
