import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useAccount, useNetwork } from 'core-kit/hooks/web3'

export const useValidNetworkButton = () => {
  const { account } = useAccount()
  const { chainId } = useNetwork()
  const poolConfig = useTradingPanelPoolConfig()

  return {
    isDisconnected: !account,
    isWrongNetwork: chainId !== poolConfig.chainId,
  }
}
