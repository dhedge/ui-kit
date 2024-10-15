import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useIsCompleteWithdrawStep } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useAppliedWithdrawSlippage = () => {
  const { defaultWithdrawSlippage } = useConfigContextParams()
  const isCompleteWithdrawStep = useIsCompleteWithdrawStep()

  const [{ slippage, minSlippage }] = useTradingPanelSettings()

  const autoSlippage = isCompleteWithdrawStep
    ? minSlippage ?? defaultWithdrawSlippage
    : defaultWithdrawSlippage

  return slippage === 'auto' ? autoSlippage : slippage
}
