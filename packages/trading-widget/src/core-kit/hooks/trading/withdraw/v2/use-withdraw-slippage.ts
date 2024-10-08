import { DEFAULT_WITHDRAW_SLIPPAGE } from 'core-kit/const'
import { useTradingPanelSettings } from 'core-kit/hooks/state'

export const useWithdrawSlippage = () => {
  const [{ slippage }] = useTradingPanelSettings()

  return slippage === 'auto' ? DEFAULT_WITHDRAW_SLIPPAGE : slippage
}
