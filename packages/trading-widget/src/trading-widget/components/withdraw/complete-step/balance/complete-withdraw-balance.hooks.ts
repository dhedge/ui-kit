import {
  useCompleteWithdrawTotalUsdValue,
  useCompleteWithdrawTrackedAssets,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { formatToUsd } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useCompleteWithdrawBalance = () => {
  const { stablePrecision } = useConfigContextParams()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  const usdAmount = useCompleteWithdrawTotalUsdValue()
  const showClaimButton = useHasSwappableAssets()

  return {
    assets,
    usdAmount: formatToUsd({
      value: usdAmount,
      maximumFractionDigits: stablePrecision,
    }),
    showClaimButton,
  }
}
