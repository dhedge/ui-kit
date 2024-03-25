import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useDepositQuote } from 'core-kit/hooks/trading/deposit'

export const useDepositTabPanel = () => {
  const poolConfig = useTradingPanelPoolConfig()
  useDepositQuote(poolConfig)
}
