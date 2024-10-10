import { useIsWithdrawSwapStep } from 'core-kit/hooks/trading/withdraw/swap-step'

export const useWithdrawTabPanel = () => {
  const isWithdrawUnrollStep = !useIsWithdrawSwapStep()

  return {
    isWithdrawUnrollStep,
  }
}
