import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

export const useTradingPanelSettings = (): [
  TradingPanelState['settings'],
  TradingPanelActionsState['updateTradingSettings'],
] => [
  useTradingPanelState().settings,
  useTradingPanelActions().updateTradingSettings,
]
