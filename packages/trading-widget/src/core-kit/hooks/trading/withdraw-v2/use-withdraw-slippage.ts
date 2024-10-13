import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useWithdrawSlippage = () => {
  const { defaultWithdrawSlippage } = useConfigContextParams()

  const [{ slippage }] = useTradingPanelSettings()

  return slippage === 'auto' ? defaultWithdrawSlippage : slippage
}
