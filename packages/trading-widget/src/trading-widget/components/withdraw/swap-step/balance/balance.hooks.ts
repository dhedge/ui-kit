import {
  useWithdrawSwapUsdValue,
  useWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw/swap-step'
import { formatToUsd } from 'core-kit/utils'

export const useWithdrawBalance = () => {
  const { data: assets = [] } = useWithdrawTrackedAssets()
  const usdAmount = useWithdrawSwapUsdValue()

  return { assets, usdAmount: formatToUsd({ value: usdAmount }) }
}
