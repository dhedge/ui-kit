import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useWithdrawQuote } from 'core-kit/hooks/trading/withdraw'

export const useWithdrawTabPanel = () => {
  const poolConfig = useTradingPanelPoolConfig()
  useWithdrawQuote(poolConfig)
}
