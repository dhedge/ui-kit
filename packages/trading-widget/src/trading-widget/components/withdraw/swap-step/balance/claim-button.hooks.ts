import {
  useHandleWithdrawSwap,
  useWithdrawSwapTransaction,
} from 'core-kit/hooks/trading/withdraw-v2/swap-step'

export const useClaimButton = () => {
  const withdraw = useWithdrawSwapTransaction({ executeWithoutSwap: true })
  const { disabled, label, handleTrade } = useHandleWithdrawSwap({
    withdraw,
    executeWithoutSwap: true,
  })

  return { disabled, label, handleTrade }
}
