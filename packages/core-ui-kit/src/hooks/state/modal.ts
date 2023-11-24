import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelModal = (): [
  TradingPanelState['modal'],
  TradingPanelActionsState['updateTradingModal'],
] => [useTradingPanelState().modal, useTradingPanelActions().updateTradingModal]
