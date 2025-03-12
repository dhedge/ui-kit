import { useNetwork } from 'core-kit/hooks/web3'
import { useLimitOrderState } from 'limit-orders/hooks/state'

export const useNetworkCheckButton = () => {
  const { chainId, switchNetwork } = useNetwork()
  const { vaultChainId } = useLimitOrderState()

  const handleNetworkSwitch = () => {
    switchNetwork?.({ chainId: vaultChainId })
  }

  return {
    isWrongNetwork: chainId !== vaultChainId,
    handleNetworkSwitch,
  }
}
