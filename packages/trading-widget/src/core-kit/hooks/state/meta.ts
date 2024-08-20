import { useCallback } from 'react'

import { CUSTOM_LOCK_TIME, DEFAULT_DEPOSIT_METHOD } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

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
  const { depositParams, chainId } = useTradingPanelPoolConfig()
  const { chainCustomLockTimeMap, defaultLockTime } = useConfigContextParams()

  if (depositParams.method === 'depositWithCustomCooldown') {
    return chainCustomLockTimeMap[chainId] ?? CUSTOM_LOCK_TIME
  }

  return defaultLockTime
}
