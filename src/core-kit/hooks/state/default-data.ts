import { useTradingPanelState } from 'core-kit/hooks/state/context'

export const useTradingPanelDefaultChainId = () =>
  useTradingPanelState().defaultChainId
