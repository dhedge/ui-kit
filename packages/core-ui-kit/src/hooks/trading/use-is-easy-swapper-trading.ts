import { useTradingPanelPoolConfig } from 'hooks/state'

export const useIsEasySwapperTrading = () => {
  const poolConfig = useTradingPanelPoolConfig()

  return !poolConfig.usePoolLogicDeposit
}
