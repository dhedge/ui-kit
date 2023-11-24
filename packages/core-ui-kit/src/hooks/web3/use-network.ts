import { DEFAULT_CHAIN_ID } from 'const'
import type { Chain, ChainId } from 'types/web3.types'
import {
  useNetwork as useWagmiNetwork,
  useSwitchNetwork as useWagmiSwitchNetwork,
} from 'wagmi'

const isSupportedChainId = (
  data: unknown,
  configuredChains: Chain[],
): data is ChainId => configuredChains.some(({ id }) => id === data)

interface UseNetworkData {
  chain: ReturnType<typeof useWagmiNetwork>['chain']
  chains: ReturnType<typeof useWagmiNetwork>['chains']
  switchNetwork: ReturnType<typeof useWagmiSwitchNetwork>['switchNetwork']
  switchNetworkAsync: ReturnType<
    typeof useWagmiSwitchNetwork
  >['switchNetworkAsync']
  isSupported: boolean
  chainId: ChainId | undefined
  supportedChainId: ChainId
}

export const useNetwork = (): UseNetworkData => {
  const { chain, chains } = useWagmiNetwork()
  const { switchNetwork, switchNetworkAsync } = useWagmiSwitchNetwork()
  const chainId = chain?.id
  const isSupported = isSupportedChainId(chainId, chains)

  return {
    chain,
    isSupported,
    switchNetwork,
    switchNetworkAsync,
    chainId: isSupported ? chainId : undefined,
    supportedChainId: isSupportedChainId(chainId, chains)
      ? chainId
      : DEFAULT_CHAIN_ID,
    chains,
  }
}
