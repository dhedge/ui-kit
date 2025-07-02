import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useIsBatchContractWritesSupported } from 'core-kit/hooks/web3'

export const useIsBatchContractWritesTrading = () => {
  const isBatchContractWritesSupported = useIsBatchContractWritesSupported()
  const [{ isBatchTransactionsEnabled }] = useTradingPanelSettings()

  return isBatchContractWritesSupported && isBatchTransactionsEnabled
}
