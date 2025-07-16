import { useAccount, useConfig, useSwitchChain } from 'wagmi'

import { useTradingPanelDefaultChainId } from 'core-kit/hooks/state'
import type { ChainId } from 'core-kit/types/web3.types'

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
  const defaultChainId = useTradingPanelDefaultChainId()
  const chainId = chain?.id
  const isSupported = isSupportedChainId(chainId, chains)
  const fallbackChainId =
    defaultChainId && isSupportedChainId(defaultChainId, chains)
      ? defaultChainId
      : chains[0].id

  return {
    chain,
    isSupported,
    switchNetwork: switchChain,
    switchNetworkAsync: switchChainAsync,
    chainId: isSupported ? chainId : undefined,
    supportedChainId: isSupportedChainId(chainId, chains)
      ? chainId
      : fallbackChainId,
    chains,
  }
}
