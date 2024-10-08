import { useSwappedUsdValue } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-swapped-usd-value'
import { useTrackedAssets } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-tracked-assets'
import { formatToUsd } from 'core-kit/utils'

export const useWithdrawBalance = () => {
  const { data: assets = [] } = useTrackedAssets()
  const usdAmount = useSwappedUsdValue()

  return { assets, usdAmount: formatToUsd({ value: usdAmount }) }
}
