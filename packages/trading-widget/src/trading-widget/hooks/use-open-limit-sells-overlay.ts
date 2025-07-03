import { useCallback } from 'react'

import {
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useOpenLimitSellsOverlay = () => {
  const [{ openLimitOrderModalAfterBuy }] = useTradingPanelSettings()
  const { pricingAsset } = useTradingPanelPoolConfig()
  const dispatch = useOverlayDispatchContext()

  return useCallback(() => {
    if (openLimitOrderModalAfterBuy && !!pricingAsset) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: OVERLAY.LIMIT_SELLS,
          isOpen: true,
        },
      })
    }
  }, [openLimitOrderModalAfterBuy, dispatch, pricingAsset])
}
