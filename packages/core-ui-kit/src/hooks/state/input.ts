import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

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
