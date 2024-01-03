import { useTradingPanelPoolConfig } from 'hooks/state'
import { isSynthetixV3Vault } from 'utils'

export const useIsEasySwapperTrading = () => {
  const poolConfig = useTradingPanelPoolConfig()

  return !isSynthetixV3Vault(poolConfig.address)
}
