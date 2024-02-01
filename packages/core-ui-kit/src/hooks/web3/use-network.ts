import { useAccount, useConfig, useSwitchChain } from 'wagmi'

import { DEFAULT_CHAIN_ID } from 'const'
import type { ChainId } from 'types/web3.types'

const isSupportedChainId = (
  data: unknown,
  configuredChains: ReturnType<typeof useConfig>['chains'],
): data is ChainId => configuredChains.some(({ id }) => id === data)

interface UseNetworkData {
  chain: ReturnType<typeof useAccount>['chain']
  chains: ReturnType<typeof useConfig>['chains']
  switchNetwork: ReturnType<typeof useSwitchChain>['switchChain']
  switchNetworkAsync: ReturnType<typeof useSwitchChain>['switchChainAsync']
  isSupported: boolean
  chainId: ChainId | undefined
  supportedChainId: ChainId
}

export const useNetwork = (): UseNetworkData => {
  const { chain } = useAccount()
  const { chains } = useConfig()
  const { switchChain, switchChainAsync } = useSwitchChain()
  const chainId = chain?.id
  const isSupported = isSupportedChainId(chainId, chains)

  return {
    chain,
    isSupported,
    switchNetwork: switchChain,
    switchNetworkAsync: switchChainAsync,
    chainId: isSupported ? chainId : undefined,
    supportedChainId: isSupportedChainId(chainId, chains)
      ? chainId
      : DEFAULT_CHAIN_ID,
    chains,
  }
}
