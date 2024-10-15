import {
  useCompleteWithdrawTransaction,
  useHandleCompleteWithdraw,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'

const skipSwap = true

export const useClaimButton = () => {
  const withdraw = useCompleteWithdrawTransaction({ skipSwap })
  const { disabled, label, handleTrade } = useHandleCompleteWithdraw({
    withdraw,
    skipSwap,
  })

  return { disabled, label, handleTrade }
}
