import type {
  TradingPanelActionsState,
  TradingPanelStateModal,
} from 'core-kit/types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelModal = (): [
  TradingPanelStateModal,
  TradingPanelActionsState['updateTradingModal'],
] => [useTradingPanelState().modal, useTradingPanelActions().updateTradingModal]
