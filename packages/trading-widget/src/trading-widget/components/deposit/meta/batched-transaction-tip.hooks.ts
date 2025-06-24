import { useDepositAllowance } from 'core-kit/hooks/trading/deposit-v2'
import { useIsBatchContractWritesSupported } from 'core-kit/hooks/web3'

export const useBatchedTransactionTip = () => {
  const isBatchContractWritesSupported = useIsBatchContractWritesSupported()
  const { canSpend } = useDepositAllowance()

  return { displayTip: isBatchContractWritesSupported && !canSpend }
}
