import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

export const useTradingPanelInput = () => useTradingPanelState().input

export const useSendTokenInput = (): [
  TradingPanelState['input']['sendToken'],
  TradingPanelActionsState['updateSendTokenInput'],
] => [
  useTradingPanelInput().sendToken,
  useTradingPanelActions().updateSendTokenInput,
]

export const useReceiveTokenInput = (): [
  TradingPanelState['input']['receiveToken'],
  TradingPanelActionsState['updateReceiveTokenInput'],
] => [
  useTradingPanelInput().receiveToken,
  useTradingPanelActions().updateReceiveTokenInput,
]
