import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useIsWithdrawSwapStep } from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useAppliedWithdrawSlippage = () => {
  const { defaultWithdrawSlippage } = useConfigContextParams()
  const isSwapStep = useIsWithdrawSwapStep()

  const [{ slippage, minSlippage }] = useTradingPanelSettings()

  const autoSlippage = isSwapStep
    ? minSlippage ?? defaultWithdrawSlippage
    : defaultWithdrawSlippage

  return slippage === 'auto' ? autoSlippage : slippage
}
