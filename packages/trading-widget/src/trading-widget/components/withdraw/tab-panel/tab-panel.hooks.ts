import { useMinWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useIsCompleteWithdrawStep } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step'

export const useWithdrawTabPanel = () => {
  useMinWithdrawSlippage()
  const isMultiAssetWithdraw = useIsMultiAssetWithdraw()
  const { isCompleteWithdrawStep } = useIsCompleteWithdrawStep()

  return {
    isCompleteWithdrawStep,
    isMultiAssetWithdraw,
    isStep1Active: !isCompleteWithdrawStep,
  }
}
