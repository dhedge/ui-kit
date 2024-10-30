import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useWithdrawalVaultAddress } from 'core-kit/hooks/trading/withdraw-v2'
import {
  useCompleteWithdrawTotalUsdValue,
  useCompleteWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { formatToUsd, getExplorerLink } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useCompleteWithdrawBalance = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const { stablePrecision } = useConfigContextParams()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  const usdAmount = useCompleteWithdrawTotalUsdValue()
  const { data: withdrawalVaultAddress = AddressZero } =
    useWithdrawalVaultAddress()

  return {
    assets,
    usdAmount: formatToUsd({
      value: usdAmount,
      maximumFractionDigits: stablePrecision,
    }),
    withdrawalVaultLink: getExplorerLink(
      withdrawalVaultAddress,
      'address',
      chainId,
    ),
  }
}
