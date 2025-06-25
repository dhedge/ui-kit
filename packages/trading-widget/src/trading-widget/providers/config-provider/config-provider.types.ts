import type { ChainId } from 'core-kit/types'

export interface ConfigProviderParams {
  isGeoBlocked: boolean
  isSanctioned: boolean
  depositQuoteDiffWarningThreshold: number
  depositQuoteDiffErrorThreshold: number
  defaultWithdrawSlippage: number
  defaultSwapTransactionSlippage: number
  defaultNoSwapMinDepositAmountGap: number
  defaultNotificationDuration: number
  defaultLockTime: string
  stablePrecision: number
  defaultPrecision: number
  termsOfUseAccepted: boolean
  standalone: boolean
  chainConfig: Partial<Record<ChainId, { name: string; iconPath: string }>>
  isAllAssetsWithdrawOptionDefault: boolean
  aaveOffchainWithdrawMinValue: number
  getFallbackIconPath: (tokenName: string) => string
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
