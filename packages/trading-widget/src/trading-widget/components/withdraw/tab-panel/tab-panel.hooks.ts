import { useIsWithdrawV2SwapStep } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-is-withdraw-v2-swap-step'

export const useWithdrawTabPanel = () => {
  const isWithdrawUnrollStep = !useIsWithdrawV2SwapStep()

  return {
    isWithdrawUnrollStep,
  }
}
