import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

export const useTradingPanelType = (): [
  TradingPanelState['type'],
  TradingPanelActionsState['setTradingType'],
] => [useTradingPanelState().type, useTradingPanelActions().setTradingType]

export const useIsDepositTradingPanelType = (): boolean =>
  useTradingPanelState().type === 'deposit'
