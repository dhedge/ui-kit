import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type {
  TradingPanelActionsState,
  TradingPanelStateModal,
} from 'core-kit/types/state.types'

export const useTradingPanelModal = (): [
  TradingPanelStateModal,
  TradingPanelActionsState['updateTradingModal'],
] => [useTradingPanelState().modal, useTradingPanelActions().updateTradingModal]
