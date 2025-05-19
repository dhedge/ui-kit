export type TermsKey =
  | 'termsPoint1'
  | 'termsPoint2'
  | 'termsPoint3'
  | 'termsPoint4'
  | 'termsPoint5'

type TermsMap = {
  [key in TermsKey]: string
}

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
  limitSellsTitle: string
  [key: string]: string
} & TermsMap

export interface TranslationProviderProps {
  config?: Partial<TranslationMap>
}
