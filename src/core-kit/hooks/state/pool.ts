import { useMemo } from 'react'

import { EMPTY_POOL_CONFIG } from 'core-kit/const'
import { useUpdatePoolFallbackData } from 'core-kit/hooks/state'
import {
  useTradingPanelActions,
  useTradingPanelState,
} from 'core-kit/hooks/state/context'
import type { PoolConfig } from 'core-kit/types/config.types'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'
import type { Address } from 'core-kit/types/web3.types'

export const useTradingPanelPoolAddress = (): [
  TradingPanelState['poolAddress'],
  TradingPanelActionsState['setPoolAddress'],
] => [
  useTradingPanelState().poolAddress,
  useTradingPanelActions().setPoolAddress,
]

export const useTradingPanelPoolConfig = (): PoolConfig => {
  const { poolAddress, poolConfigMap } = useTradingPanelState()
  return poolConfigMap[poolAddress] ?? EMPTY_POOL_CONFIG
}

export const useTradingPanelPoolConfigs = (): PoolConfig[] => {
  const { poolConfigMap } = useTradingPanelState()
  return useMemo(() => Object.values(poolConfigMap), [poolConfigMap])
}

export const useIsPoolAddress = (address: Address) => {
  const configs = useTradingPanelPoolConfigs()
  return useMemo(
    () => configs.some((config) => config.address === address),
    [configs, address],
  )
}

export const useTradingPanelPoolFallbackData = (): [
  TradingPanelState['poolFallbackData'],
  TradingPanelActionsState['updatePoolFallbackData'],
] => {
  const { poolFallbackData, poolAddress } = useTradingPanelState()
  const updatePoolFallback = useUpdatePoolFallbackData()

  return [
    poolFallbackData.address === poolAddress
      ? poolFallbackData
      : { address: poolAddress },
    updatePoolFallback,
  ]
}
