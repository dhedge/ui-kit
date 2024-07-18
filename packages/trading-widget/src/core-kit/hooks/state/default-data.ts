import { useTradingPanelState } from './context'

export const useTradingPanelDefaultChainId = () =>
  useTradingPanelState().defaultChainId
