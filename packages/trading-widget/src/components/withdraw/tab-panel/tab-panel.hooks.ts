import { useTradingPanelPoolConfig } from '@dhedge/core-ui-kit/hooks/state'
import { useWithdrawQuote } from '@dhedge/core-ui-kit/hooks/trading/withdraw'

export const useWithdrawTabPanel = () => {
  const poolConfig = useTradingPanelPoolConfig()
  useWithdrawQuote(poolConfig)
}
