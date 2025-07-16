import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

export const useTradingPanelTransactions = (): [
  TradingPanelState['transactions'],
  TradingPanelActionsState['updateTransactions'],
] => [
  useTradingPanelState().transactions,
  useTradingPanelActions().updateTransactions,
]
