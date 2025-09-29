import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type { ChainId, TradingToken } from 'core-kit/types'
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

export const useCustomDepositTokensPerChain = (): [
  Partial<Record<ChainId, TradingToken[]>> | undefined,
  TradingPanelActionsState['updateCustomDepositTokensPerChain'],
] => [
  useTradingPanelState().customDepositTokensPerChain,
  useTradingPanelActions().updateCustomDepositTokensPerChain,
]
