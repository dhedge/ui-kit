import { useHandleTrade } from 'core-kit/hooks/trading'
import { useDeposit } from 'core-kit/hooks/trading/deposit-v2'

import {
  useConfigContextActions,
  useConfigContextParams,
} from 'trading-widget/providers/config-provider'

import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useDepositTradeButton = () => {
  const { onAcceptTermsOfUse } = useConfigContextActions()
  const { termsOfUseAccepted } = useConfigContextParams()
  const deposit = useDeposit()
  // TODO consider transforming label into param for mapping
  const { disabled, label, handleTrade } = useHandleTrade(deposit)
  const dispatch = useOverlayDispatchContext()

  const handleClick = () => {
    if (termsOfUseAccepted) {
      handleTrade()
    } else {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: OVERLAY.TERMS_OF_USE,
          isOpen: true,
          onConfirm: async (setPendingState) => {
            try {
              setPendingState(true)
              const isAccepted = await onAcceptTermsOfUse()

              if (isAccepted) {
                handleTrade()
              }
            } catch (error) {
              console.error('Failed to verify terms of use acceptance')
            } finally {
              setPendingState(false)
            }
          },
        },
      })
    }
  }

  return {
    handleClick,
    disabled,
    label,
  }
}
