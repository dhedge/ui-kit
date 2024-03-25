import { useHandleTrade } from 'core-kit/hooks/trading'
import { useDeposit } from 'core-kit/hooks/trading/deposit'

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
          onConfirm: () => {
            onAcceptTermsOfUse()
            handleTrade()
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
