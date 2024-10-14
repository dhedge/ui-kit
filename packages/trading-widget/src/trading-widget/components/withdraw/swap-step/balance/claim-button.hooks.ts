import {
  useHandleWithdrawSwap,
  useWithdrawSwapTransaction,
} from 'core-kit/hooks/trading/withdraw-v2/swap-step'

const skipSwap = true

export const useClaimButton = () => {
  const withdraw = useWithdrawSwapTransaction({ skipSwap })
  const { disabled, label, handleTrade } = useHandleWithdrawSwap({
    withdraw,
    skipSwap,
  })

  return { disabled, label, handleTrade }
}
