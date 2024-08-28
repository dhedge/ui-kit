import {
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_SWAP_TRANSACTION_SLIPPAGE,
} from 'core-kit/const'
import { useTradingPanelSettings } from 'core-kit/hooks/state'

import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'

export const useAppliedDepositSlippage = () => {
  const [{ slippage }] = useTradingPanelSettings()
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()
  const isAutoSlippage = slippage === 'auto'

  if (isAutoSlippage) {
    return isDepositWithSwapTransaction
      ? DEFAULT_SWAP_TRANSACTION_SLIPPAGE
      : DEFAULT_DEPOSIT_SLIPPAGE
  }

  return slippage
}
