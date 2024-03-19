import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

export const useIsEasySwapperTrading = () => {
  const poolConfig = useTradingPanelPoolConfig()

  return !poolConfig.usePoolLogicDeposit
}
