import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelTransactions = (): [
  TradingPanelState['transactions'],
  TradingPanelActionsState['updateTransactions'],
] => [
  useTradingPanelState().transactions,
  useTradingPanelActions().updateTransactions,
]
