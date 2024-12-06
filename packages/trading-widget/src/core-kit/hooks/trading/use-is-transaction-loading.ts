import { useTradingPanelModal } from 'core-kit/hooks/state'
import type { TransactionAction } from 'core-kit/types'

export const useIsTransactionLoading = (transaction: TransactionAction) => {
  const [{ action, status }] = useTradingPanelModal()
  const isLoading = status === 'Wallet' || status === 'Mining'

  return action === transaction && isLoading
}
