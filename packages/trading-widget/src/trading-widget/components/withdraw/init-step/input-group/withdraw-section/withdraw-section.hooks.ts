import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useInitWithdrawEstimatedReceiveAssets } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { formatToUsd } from 'core-kit/utils'

export const useWithdrawSection = () => {
  const [receiveToken] = useReceiveTokenInput()
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
    assetSymbol: receiveToken.symbol,
  }
}
