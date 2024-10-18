import { useCompleteWithdrawTransaction } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useHandleCompleteWithdraw } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-handle-complete-withdraw'

export const useSwapButton = () => {
  const withdraw = useCompleteWithdrawTransaction()
  const { disabled, label, handleTrade } = useHandleCompleteWithdraw({
    withdraw,
  })

  return {
    disabled,
    label,
    handleTrade,
  }
}
