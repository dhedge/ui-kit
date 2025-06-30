import { useCapabilities } from 'wagmi'

import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useNetwork } from 'core-kit/hooks/web3/use-network'

export const useIsBatchContractWritesSupported = () => {
  const { chainId } = useNetwork()
  const { data: capabilities } = useCapabilities()
  const [{ isBatchTransactionsEnabled }] = useTradingPanelSettings()

  if (!chainId || !capabilities) {
    return false
  }

  const atomicStatus = capabilities?.[chainId]?.atomic?.status

  return (
    !!atomicStatus &&
    atomicStatus !== 'unsupported' &&
    isBatchTransactionsEnabled
  )
}
