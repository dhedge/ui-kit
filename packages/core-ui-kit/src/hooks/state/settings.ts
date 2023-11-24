import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelSettings = (): [
  TradingPanelState['settings'],
  TradingPanelActionsState['updateTradingSettings'],
] => [
  useTradingPanelState().settings,
  useTradingPanelActions().updateTradingSettings,
]
