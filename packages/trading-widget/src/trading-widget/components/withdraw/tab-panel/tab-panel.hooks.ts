import { useMinWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useIsWithdrawSwapStep } from 'core-kit/hooks/trading/withdraw-v2/swap-step'

export const useWithdrawTabPanel = () => {
  useMinWithdrawSlippage()
  const isWithdrawUnrollStep = !useIsWithdrawSwapStep()

  return {
    isWithdrawUnrollStep,
  }
}
