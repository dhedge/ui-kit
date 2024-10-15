import { useMinWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useIsCompleteWithdrawStep } from 'core-kit/hooks/trading/withdraw-v2/complete-step'

export const useWithdrawTabPanel = () => {
  useMinWithdrawSlippage()
  const isCompleteWithdrawStep = !useIsCompleteWithdrawStep()

  return {
    isCompleteWithdrawStep,
  }
}
