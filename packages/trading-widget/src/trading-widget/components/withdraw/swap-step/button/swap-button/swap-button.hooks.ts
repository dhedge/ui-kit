import { useWithdrawSwapTransaction } from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { useHandleWithdrawSwap } from 'core-kit/hooks/trading/withdraw-v2/swap-step/use-handle-withdraw-swap'

export const useSwapButton = () => {
  const withdraw = useWithdrawSwapTransaction()
  const { disabled, label, handleTrade } = useHandleWithdrawSwap({ withdraw })

  return {
    disabled,
    label,
    handleTrade,
  }
}
