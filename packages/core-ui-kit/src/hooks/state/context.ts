import { TradingPanelActionsContext, TradingPanelStateContext } from 'providers'
import { useContext } from 'react'

export const useTradingPanelState = () => useContext(TradingPanelStateContext)

export const useTradingPanelActions = () =>
  useContext(TradingPanelActionsContext)
