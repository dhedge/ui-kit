import { useWithdrawSwapTransaction } from 'core-kit/hooks/trading/withdraw/swap-step'
import { useHandleWithdrawSwap } from 'core-kit/hooks/trading/withdraw/use-handle-withdraw-swap'

export const useSwapTradeButton = () => {
  const swap = useWithdrawSwapTransaction()
  // TODO consider transforming label into param for mapping
  const { disabled, label, handleTrade } = useHandleWithdrawSwap(swap)

  return {
    disabled,
    label,
    handleTrade,
  }
}
