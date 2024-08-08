import { useCallback } from 'react'

import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelMeta = (): [
  TradingPanelState['meta'],
  TradingPanelActionsState['updateTradingMeta'],
] => [useTradingPanelState().meta, useTradingPanelActions().updateTradingMeta]
export const useTradingPanelApprovingStatus = (): [
  TradingPanelState['meta']['approvingStatus'],
  (approvingStatus: TradingPanelState['meta']['approvingStatus']) => void,
] => {
  const [meta, updateMeta] = useTradingPanelMeta()

  const setApprovingStatus = useCallback(
    (approvingStatus: TradingPanelState['meta']['approvingStatus']) =>
      updateMeta({ approvingStatus }),
    [updateMeta],
  )

  return [meta.approvingStatus, setApprovingStatus]
}
