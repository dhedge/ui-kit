import { useTradingPanelApprovingStatus } from 'core-kit/hooks/state'
import { useIsTradingEnabled } from 'core-kit/hooks/trading'

export interface ApproveButtonProps {
  symbol: string
  onApprove: () => void
}

export const useApproveButton = () => {
  const tradingEnabled = useIsTradingEnabled()
  const [approvingStatus] = useTradingPanelApprovingStatus()
  const isLoading = approvingStatus === 'success'

  return {
    disabled: !tradingEnabled || isLoading,
    isLoading,
  }
}
