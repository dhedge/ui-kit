import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step'

export const useCompleteWithdrawTotalUsdValue = (): number => {
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()

  return assets.reduce((acc, { balance, price }) => acc + balance * price, 0)
}
