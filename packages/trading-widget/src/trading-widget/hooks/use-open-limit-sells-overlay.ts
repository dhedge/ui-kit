import { useCallback } from 'react'

import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useOpenLimitSellsOverlay = () => {
  const { pricingAsset } = useTradingPanelPoolConfig()
  const dispatch = useOverlayDispatchContext()

  return useCallback(() => {
    if (pricingAsset) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: OVERLAY.LIMIT_SELLS,
          isOpen: true,
        },
      })
    }
  }, [dispatch, pricingAsset])
}
