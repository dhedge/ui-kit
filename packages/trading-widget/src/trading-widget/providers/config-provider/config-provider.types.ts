import type { ChainId } from 'core-kit/types'

export interface ConfigProviderParams {
  isGeoBlocked: boolean
  isSanctioned: boolean
  depositQuoteDiffWarningThreshold: number
  depositQuoteDiffErrorThreshold: number
  defaultWithdrawSlippageScale: number[]
  defaultSwapTransactionSlippage: number
  defaultNoSwapMinDepositAmountGap: number
  defaultLockTime: string
  stablePrecision: number
  defaultPrecision: number
  stakingChainId: ChainId
  termsOfUseAccepted: boolean
  standalone: boolean
  chainConfig: Partial<Record<ChainId, { name: string; iconPath: string }>>
}

export interface ConfigProviderActions {
  onConnect: () => void
  onAcceptTermsOfUse: () => Promise<boolean>
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
