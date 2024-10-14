import {
  useTotalSwapUsdValue,
  useWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { formatToUsd } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useWithdrawBalance = () => {
  const { stablePrecision } = useConfigContextParams()
  const { data: assets = [] } = useWithdrawTrackedAssets()
  const usdAmount = useTotalSwapUsdValue()

  return {
    assets,
    usdAmount: formatToUsd({
      value: usdAmount,
      maximumFractionDigits: stablePrecision,
    }),
  }
}
