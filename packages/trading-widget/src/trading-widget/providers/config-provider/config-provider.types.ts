import type { ChainId } from 'core-kit/types'

export interface ConfigProviderParams {
  isGeoBlocked: boolean
  isSanctioned: boolean
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
  standalone: boolean
  chainConfig: Partial<Record<ChainId, { name: string; iconPath: string }>>
}

export interface ConfigProviderActions {
  onConnect: () => void
  onAcceptTermsOfUse: () => void
}

export interface ConfigProviderProps {
  config?: {
    params?: Partial<ConfigProviderParams>
    actions?: Partial<ConfigProviderActions>
  }
}

export type ConfigProviderState = {
  params: ConfigProviderParams
  actions: ConfigProviderActions
}
