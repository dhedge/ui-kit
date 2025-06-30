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
  lowerLimitLabel: string
  lowerLimitSubtitle: string
  upperLimitLabel: string
  upperLimitSubtitle: string
  price: string
  currentPrice: string
  limitOrderTerms: string
  modify: string
  delete: string
  cancel: string
  invalidLimitOrderPriceError: string
  minimumVaultBalanceRequired: string
  limitOrdersTitle: string
  [key: string]: string
} & TermsMap

export interface TranslationProviderProps {
  config?: Partial<TranslationMap>
}
