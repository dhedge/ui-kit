import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useHandleTrade } from 'core-kit/hooks/trading'
import { useInitWithdrawTransaction } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { useInitWithdrawComplexAssetData } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-init-withdraw-complex-asset-data'
import { isFmpAirdropVaultAddress } from 'core-kit/utils'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import { OVERLAY } from 'trading-widget/types'

export const useInitWithdrawButton = () => {
  const t = useTranslationContext()
  const withdraw = useInitWithdrawTransaction()
  const { isLoading } = useInitWithdrawComplexAssetData()

  const { disabled, label, handleTrade } = useHandleTrade(withdraw)
  const dispatch = useOverlayDispatchContext()
  const { address } = useTradingPanelPoolConfig()
  const showFmpWithdrawalOverlay = isFmpAirdropVaultAddress(address)

  return {
    disabled,
    label: isLoading ? t.loading : label,
    isLoading,
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
