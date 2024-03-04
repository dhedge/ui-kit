import { useTradingPanelPoolConfig } from '@dhedge/core-ui-kit/hooks/state'
import { useDepositQuote } from '@dhedge/core-ui-kit/hooks/trading/deposit'

export const useDepositTabPanel = () => {
  const poolConfig = useTradingPanelPoolConfig()
  useDepositQuote(poolConfig)
}
