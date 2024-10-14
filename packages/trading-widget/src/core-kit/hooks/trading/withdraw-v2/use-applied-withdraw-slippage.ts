import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useAppliedWithdrawSlippage = () => {
  const { defaultWithdrawSlippage } = useConfigContextParams()

  const [{ slippage, minSlippage }] = useTradingPanelSettings()

  return slippage === 'auto' ? minSlippage ?? defaultWithdrawSlippage : slippage
}
