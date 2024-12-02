import { useIsTradingEnabled } from 'core-kit/hooks/trading'

export interface ApproveButtonProps {
  symbol: string
  onApprove: () => void
}

export const useApproveButton = () => {
  const tradingEnabled = useIsTradingEnabled()

  return {
    disabled: !tradingEnabled,
  }
}
