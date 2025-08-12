import type { ApyCurrency } from 'core-kit/types'

export const CURRENCY_SYMBOL_MAP: Record<ApyCurrency, string> = {
  USD: '$',
  ETH: 'Ξ',
  BTC: '₿',
}

export const CURRENCY_DECIMALS_MAP: Record<ApyCurrency, number> = {
  USD: 2,
  ETH: 4,
  BTC: 6,
}

export const STABLE_TOKEN_SYMBOLS = ['USDC', 'USDT']
