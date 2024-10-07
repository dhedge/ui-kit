import { useIsWithdrawSwapStep } from 'core-kit/hooks/trading/withdraw/v2/use-is-withdraw-swap-step'

export const useWithdrawTabPanel = () => {
  const isWithdrawUnrollStep = !useIsWithdrawSwapStep()

  return {
    isWithdrawUnrollStep,
  }
}
