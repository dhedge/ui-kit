import { useMemo } from 'react'

import { DEFAULT_DEPOSIT_METHOD, EMPTY_POOL_CONFIG } from 'core-kit/const'
import { useUpdatePoolFallbackData } from 'core-kit/hooks/state'
import type { PoolConfig } from 'core-kit/types/config.types'
import type {
  TradingPanelActionsState,
  TradingPanelState,
} from 'core-kit/types/state.types'
import type { DepositMethodName } from 'core-kit/types/trading-panel.types'
import type { Address } from 'core-kit/types/web3.types'

import { useTradingPanelActions, useTradingPanelState } from './context'

export const useTradingPanelPoolAddress = (): [
  TradingPanelState['poolAddress'],
  TradingPanelActionsState['setPoolAddress'],
] => [
  useTradingPanelState().poolAddress,
  useTradingPanelActions().setPoolAddress,
]

export const useTradingPanelPoolConfig = () => {
  const { poolAddress, poolConfigMap } = useTradingPanelState()
  return poolConfigMap[poolAddress] ?? EMPTY_POOL_CONFIG
}

export const useTradingPanelPoolConfigs = () => {
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

export const useTradingPanelDepositMethod = (): [
  DepositMethodName,
  (
    payload: Pick<PoolConfig, 'address'> &
      Pick<PoolConfig['depositParams'], 'method'>,
  ) => void,
] => {
  const {
    depositParams: { method: depositMethod = DEFAULT_DEPOSIT_METHOD },
  } = useTradingPanelPoolConfig()
  const { updatePoolConfigDepositMethod } = useTradingPanelActions()

  return [depositMethod, updatePoolConfigDepositMethod]
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
