import {
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_DEPOSIT_SLIPPAGE_SCALE,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
} from '@dhedge/core-ui-kit/const'
import { formatDuration } from 'date-fns'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

interface ConfigProviderParams {
  isGeoBlocked: boolean
  depositQuoteDiffWarningThreshold: number
  depositQuoteDiffErrorThreshold: number
  defaultDepositSlippage: number
  defaultDepositSlippageScale: number[]
  defaultWithdrawSlippageScale: number[]
  defaultLockTime: string
  customLockTime: string
  stablePrecision: number
  defaultPrecision: number
}

interface ConfigProviderActions {
  onConnect: () => void
}

export interface ConfigProviderProps {
  config?: {
    params: Partial<ConfigProviderParams>
    actions: Partial<ConfigProviderActions>
  }
}

type ConfigProviderState = {
  params: ConfigProviderParams
  actions: ConfigProviderActions
}

export const DEFAULT_CONFIG_PARAMS: Required<
  Required<ConfigProviderProps>['config']['params']
> = {
  isGeoBlocked: false,
  depositQuoteDiffWarningThreshold: 1,
  depositQuoteDiffErrorThreshold: 3,
  defaultDepositSlippage: DEFAULT_DEPOSIT_SLIPPAGE,
  defaultDepositSlippageScale: DEFAULT_DEPOSIT_SLIPPAGE_SCALE,
  defaultWithdrawSlippageScale: DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
  defaultLockTime: formatDuration({ hours: 24 }),
  customLockTime: formatDuration({ minutes: 15 }),
  stablePrecision: 3,
  defaultPrecision: 6,
}

const defaultValue: ConfigProviderState = {
  params: {
    ...DEFAULT_CONFIG_PARAMS,
  },
  actions: {
    onConnect: () => {},
  },
}

export const ConfigProviderContext =
  createContext<ConfigProviderState>(defaultValue)

export const ConfigProvider: FC<PropsWithChildren<ConfigProviderProps>> = ({
  children,
  config = defaultValue,
}) => {
  const value = useMemo(
    () => ({
      params: {
        ...defaultValue.params,
        ...config.params,
      },
      actions: {
        ...defaultValue.actions,
        ...config.actions,
      },
    }),
    [],
  )

  return (
    <ConfigProviderContext.Provider value={value}>
      {children}
    </ConfigProviderContext.Provider>
  )
}
