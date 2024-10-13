import { useIsWithdrawSwapStep } from 'core-kit/hooks/trading/withdraw-v2/swap-step'

export const useWithdrawTabPanel = () => {
  const isWithdrawUnrollStep = !useIsWithdrawSwapStep()

  return {
    isWithdrawUnrollStep,
  }
}
