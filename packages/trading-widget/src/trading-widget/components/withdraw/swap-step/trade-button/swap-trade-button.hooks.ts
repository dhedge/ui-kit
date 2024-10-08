import { useHandleSwap } from 'core-kit/hooks/trading/withdraw/use-handle-swap'
import { useSwapTransaction } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-swap-transaction'

export const useSwapTradeButton = () => {
  const swap = useSwapTransaction()
  // TODO consider transforming label into param for mapping
  const { disabled, label, handleTrade } = useHandleSwap(swap)

  return {
    disabled,
    label,
    handleTrade,
  }
}
