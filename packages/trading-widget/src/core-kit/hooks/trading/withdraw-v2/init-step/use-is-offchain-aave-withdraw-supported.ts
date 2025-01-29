import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useIsOffchainAaveWithdrawSupported = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const { aaveOffchainWithdrawChainIds } = useConfigContextParams()

  return aaveOffchainWithdrawChainIds.includes(chainId)
}
