export type TranslationMap = {
  switchNetwork: string
  approve: string
  stopLossLabel: string
  takeProfitLabel: string
  price: string
  limitOrderTerms: string
  modify: string
  delete: string
  invalidLimitOrderPriceError: string
  invalidLimitOrderPriceErrorReversed: string
  minimumVaultBalanceRequired: string
  [key: string]: string
}

export interface TranslationProviderProps {
  config?: Partial<TranslationMap>
}
