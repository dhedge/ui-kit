import type { TranslationMap } from './translation-provider.types'

export const DEFAULT_TRANSLATION_DATA: TranslationMap = {
  switchNetwork: 'Switch Network',
  approve: 'Approve',
  stopLossLabel: 'Stop Loss',
  takeProfitLabel: 'Take Profit',
  price: 'price',
  limitOrderTerms: 'I understand and accept limit orders are not guaranteed',
  modify: 'Modify',
  invalidLimitOrderPriceError:
    'The take profit price must be higher than the mark price, and the stop loss price must be lower than the mark price.',
  invalidLimitOrderPriceErrorReversed:
    'The take profit price must be lower than the mark price, and the stop loss price must be higher than the mark price.',
  minimumVaultBalanceRequired: 'Minimum vault balance required: {amount}',
}
