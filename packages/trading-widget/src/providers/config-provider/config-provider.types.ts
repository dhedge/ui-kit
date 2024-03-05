import type { ChainId } from '@dhedge/core-ui-kit/types'

export interface ConfigProviderParams {
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
  stakingChainId: ChainId
  termsOfUseAccepted: boolean
}

export interface ConfigProviderActions {
  onConnect: () => void
  onAcceptTermsOfUse: () => void
}

export interface ConfigProviderProps {
  config?: {
    params: Partial<ConfigProviderParams>
    actions: Partial<ConfigProviderActions>
  }
}

export type ConfigProviderState = {
  params: ConfigProviderParams
  actions: ConfigProviderActions
}
