import { useInitWithdrawEstimatedReceiveAssets } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { formatToUsd } from 'core-kit/utils'

export const useSingleAssetCompositionTable = () => {
  const { data: assets = [], isLoading } =
    useInitWithdrawEstimatedReceiveAssets()
  const usdAmount = assets.reduce(
    (acc, { balance, price }) => acc + balance * price,
    0,
  )

  return {
    assets,
    isLoading,
    usdAmount: formatToUsd({ value: usdAmount }),
  }
}
