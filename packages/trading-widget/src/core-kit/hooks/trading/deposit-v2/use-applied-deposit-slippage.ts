import { DEFAULT_DEPOSIT_SLIPPAGE } from 'core-kit/const'
import { useTradingPanelSettings } from 'core-kit/hooks/state'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'

export const useAppliedDepositSlippage = () => {
  const { defaultSwapTransactionSlippage } = useConfigContextParams()
  const [{ slippage }] = useTradingPanelSettings()
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()
  const isAutoSlippage = slippage === 'auto'

  if (isAutoSlippage) {
    return isDepositWithSwapTransaction
      ? defaultSwapTransactionSlippage
      : DEFAULT_DEPOSIT_SLIPPAGE
  }

  return slippage
}
