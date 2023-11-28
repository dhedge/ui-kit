import { useContext } from 'react'

import { TradingPanelActionsContext, TradingPanelStateContext } from 'providers'

export const useTradingPanelState = () => useContext(TradingPanelStateContext)

export const useTradingPanelActions = () =>
  useContext(TradingPanelActionsContext)
