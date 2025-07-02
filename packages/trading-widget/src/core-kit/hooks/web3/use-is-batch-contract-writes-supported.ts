import { useCapabilities } from 'wagmi'

import { useNetwork } from 'core-kit/hooks/web3/use-network'

export const useIsBatchContractWritesSupported = () => {
  const { chainId } = useNetwork()
  const { data: capabilities } = useCapabilities()

  if (!chainId || !capabilities) {
    return false
  }

  const atomicStatus = capabilities?.[chainId]?.atomic?.status

  return !!atomicStatus && atomicStatus !== 'unsupported'
}
