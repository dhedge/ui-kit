import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useHandleTrade } from 'core-kit/hooks/trading'
import { useIsTransactionLoading } from 'core-kit/hooks/trading/use-is-transaction-loading'
import { useInitWithdrawTransaction } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { isFmpAirdropVaultAddress } from 'core-kit/utils'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useInitWithdrawButton = () => {
  const { withdraw, action } = useInitWithdrawTransaction()
  const { disabled, label, handleTrade } = useHandleTrade(withdraw)
  const dispatch = useOverlayDispatchContext()
  const { address } = useTradingPanelPoolConfig()
  const showFmpWithdrawalOverlay = isFmpAirdropVaultAddress(address)
  const isLoading = useIsTransactionLoading(action)

  return {
    isLoading,
    disabled,
    label,
    handleTrade: () => {
      if (showFmpWithdrawalOverlay) {
        dispatch({
          type: 'MERGE_OVERLAY',
          payload: {
            type: OVERLAY.FMP_WITHDRAWAL,
            isOpen: true,
            onConfirm: async () => {
              handleTrade()
            },
          },
        })
      } else {
        handleTrade()
      }
    },
  }
}
