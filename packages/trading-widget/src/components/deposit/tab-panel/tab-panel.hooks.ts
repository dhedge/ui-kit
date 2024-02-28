import { useDepositQuote } from '@dhedge/core-ui-kit/hooks/trading/deposit'
import { useTradingPanelPoolConfig } from '@dhedge/core-ui-kit/hooks/state'

export const useDepositTabPanel = () => {
  const poolConfig = useTradingPanelPoolConfig()
  useDepositQuote(poolConfig)
}
