import { DEFAULT_DEPOSIT_LOCKTIME_MAP, DEFAULT_DEPOSIT_METHOD } from 'const'
import { useTradingPanelPoolConfig } from 'hooks/state'
import { useCallback } from 'react'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'types/state.types'

import { useUpdateEntryFee } from './action'
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

export const useTradingPanelEntryFee = (): [
  number,
  (entryFeeSlice: Partial<TradingPanelState['entryFee']>) => void,
] => {
  const { depositParams } = useTradingPanelPoolConfig()
  const entryFee = useTradingPanelState().entryFee
  const updateEntryFee = useUpdateEntryFee()

  return [
    entryFee[depositParams.method ?? DEFAULT_DEPOSIT_METHOD],
    updateEntryFee,
  ]
}

export const useTradingPanelLockTime = (): string => {
  const { depositParams } = useTradingPanelPoolConfig()

  return DEFAULT_DEPOSIT_LOCKTIME_MAP[
    depositParams.method ?? DEFAULT_DEPOSIT_METHOD
  ]
}
