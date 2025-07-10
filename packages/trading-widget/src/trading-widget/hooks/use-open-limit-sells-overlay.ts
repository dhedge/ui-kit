import { useCallback } from 'react'

import {
  TRADING_LOG_EVENT_PARAM,
  TRADING_PANEL_LOG_EVENT,
} from 'core-kit/const'
import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useTradingPanelLogger,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useOverlayDispatchContext } from 'trading-widget/providers/overlay-provider'
import { OVERLAY } from 'trading-widget/types'

export const useOpenLimitSellsOverlay = () => {
  const log = useTradingPanelLogger()
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
      log?.(TRADING_PANEL_LOG_EVENT.OPEN_LIMIT_SELL_VIEW, {
        [TRADING_LOG_EVENT_PARAM.SOURCE.NAME]: 'overlay',
      })
    }
  }, [dispatch, displayLimitSellOverlay, log])

  return { displayLimitSellOverlay, openLimitSellOverlay }
}
