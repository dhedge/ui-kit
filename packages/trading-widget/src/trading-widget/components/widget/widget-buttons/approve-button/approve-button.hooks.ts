import { useIsTradingEnabled } from 'core-kit/hooks/trading'
import { useIsTransactionLoading } from 'core-kit/hooks/trading/use-is-transaction-loading'

export interface ApproveButtonProps {
  symbol: string
  onApprove: () => void
}

export const useApproveButton = () => {
  const tradingEnabled = useIsTradingEnabled()
  const isLoading = useIsTransactionLoading('approve')

  return {
    disabled: !tradingEnabled,
    isLoading,
  }
}
