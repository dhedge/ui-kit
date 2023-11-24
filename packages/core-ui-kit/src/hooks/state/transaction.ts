import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelTransactions = (): [
  TradingPanelState['transactions'],
  TradingPanelActionsState['updateTransactions'],
] => [
  useTradingPanelState().transactions,
  useTradingPanelActions().updateTransactions,
]
