import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'
import { OVERLAY } from 'trading-widget/types'

export const useLimitOrderWithdrawButton = () => {
  const t = useTranslationContext()
  const dispatch = useOverlayDispatchContext()

  const openLimitOrderWithdrawOverlay = () =>
    dispatch({
      type: 'MERGE_OVERLAY',
      payload: { type: OVERLAY.LIMIT_ORDER_WITHDRAW, isOpen: true },
    })

  return {
    label: t.withdrawAction,
    openLimitOrderWithdrawOverlay,
  }
}
