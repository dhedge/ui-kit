import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelType = (): [
  TradingPanelState['type'],
  TradingPanelActionsState['setTradingType'],
] => [useTradingPanelState().type, useTradingPanelActions().setTradingType]

export const useIsDepositTradingPanelType = (): boolean =>
  useTradingPanelState().type === 'deposit'
