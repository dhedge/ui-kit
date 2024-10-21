import {
  useCompleteWithdrawTransaction,
  useHandleCompleteWithdraw,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'

const isClaim = true

export const useClaimButton = () => {
  const withdraw = useCompleteWithdrawTransaction({ isClaim })
  const { disabled, label, handleTrade } = useHandleCompleteWithdraw({
    withdraw,
    isClaim,
  })

  return { disabled, label, handleTrade }
}
