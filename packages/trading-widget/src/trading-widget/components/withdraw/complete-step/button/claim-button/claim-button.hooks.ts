import {
  useCompleteWithdrawTransaction,
  useHandleCompleteWithdraw,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useValidNetworkButton } from 'trading-widget/components/widget/widget-buttons/valid-network-button/valid-network-button.hooks'

const isClaim = true

export const useClaimButton = () => {
  const { isWrongNetwork } = useValidNetworkButton()
  const withdraw = useCompleteWithdrawTransaction({ isClaim })
  const { disabled, label, handleTrade } = useHandleCompleteWithdraw({
    withdraw,
    isClaim,
  })

  return { disabled, label, handleTrade, isWrongNetwork }
}
