import { useContext } from 'react'

import {
  TradingPanelActionsContext,
  TradingPanelStateContext,
} from 'core-kit/providers'

export const useTradingPanelState = () => useContext(TradingPanelStateContext)

export const useTradingPanelActions = () =>
  useContext(TradingPanelActionsContext)
