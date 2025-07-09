import { useCallback } from 'react'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useOpenLimitSellsOverlay = () => {
  const { pricingAsset, symbol, chainId, address } = useTradingPanelPoolConfig()
  const { minLimitOrderValue } = useConfigContextParams()
  const dispatch = useOverlayDispatchContext()
  const vaultBalance = useUserTokenBalance({ symbol, address })
  const vaultTokenPrice = usePoolTokenPrice({ address, chainId })
  const vaultBalanceUsd = Number(vaultBalance) * Number(vaultTokenPrice)
  const isGreaterThanMinLimitOrderValue = vaultBalanceUsd >= minLimitOrderValue
  const displayLimitSellOverlay =
    isGreaterThanMinLimitOrderValue && !!pricingAsset

  const openLimitSellOverlay = useCallback(() => {
    if (displayLimitSellOverlay) {
      dispatch({
        type: 'MERGE_OVERLAY',
        payload: {
          type: OVERLAY.LIMIT_SELLS,
          isOpen: true,
        },
      })
    }
  }, [dispatch, displayLimitSellOverlay])

  return { displayLimitSellOverlay, openLimitSellOverlay }
}
