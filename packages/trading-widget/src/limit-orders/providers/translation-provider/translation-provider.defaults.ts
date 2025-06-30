import type { TranslationMap } from './translation-provider.types'

export const DEFAULT_TRANSLATION_DATA: TranslationMap = {
  switchNetwork: 'Switch Network',
  approve: 'Approve',
  lowerLimitLabel: 'Lower limit',
  lowerLimitSubtitle: 'Sells when price drops',
  upperLimitLabel: 'Upper limit',
  upperLimitSubtitle: 'Sells when price rises',
  price: 'price',
  currentPrice: 'Current {symbol} price',
  limitOrderTerms: 'I understand and accept limit orders are not guaranteed',
  modify: 'Modify',
  delete: 'Delete',
  cancel: 'Cancel',
  invalidLimitOrderPriceError:
    'The upper limit price must be higher than the current price, and the lower limit price must be lower than the current price.',
  minimumVaultBalanceRequired: 'Minimum vault balance required: {amount}',
  limitOrdersTitle: 'Set limit orders',
  termsPoint1:
    'Once a limit order is placed, the associated vault token balance must remain unchanged. Any transfers or manual withdrawals will prevent the order from being executed.',
  termsPoint2:
    'Revoking token approval after placing an order will prevent the order from being executed.',
  termsPoint3:
    'If the vault tokens are still subject to a lock-up period, the order cannot be executed.',
  termsPoint4:
    'Limit sells are intended to settle in USDC. In rare cases where market conditions or high slippage prevent a USDC swap, the order may be settled in the underlying tokens of the respective vault.',
  termsPoint5:
    'While limit sells are generally expected to execute, they are currently in beta and execution is not guaranteed.',
}
