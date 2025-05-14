import type { TranslationMap } from './translation-provider.types'

export const DEFAULT_TRANSLATION_DATA: TranslationMap = {
  switchNetwork: 'Switch Network',
  approve: 'Approve',
  stopLossLabel: 'Stop Loss',
  takeProfitLabel: 'Take Profit',
  price: 'price',
  limitOrderTerms:
    'I acknowledge and agree to the following terms and conditions',
  modify: 'Modify',
  delete: 'Delete',
  invalidLimitOrderPriceError:
    'The take profit price must be higher than the current price, and the stop loss price must be lower than the current price.',
  invalidLimitOrderPriceErrorReversed:
    'The take profit price must be lower than the current price, and the stop loss price must be higher than the current price.',
  minimumVaultBalanceRequired: 'Minimum vault balance required: {amount}',
}
