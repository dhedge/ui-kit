import { DEFAULT_PRECISION } from 'core-kit/const/default-data'
import type { TradingToken } from 'core-kit/types'

export const WETH_MAINNET: TradingToken = {
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  symbol: 'WETH',
  decimals: DEFAULT_PRECISION,
  value: '',
}

export const USDC_MAINNET: TradingToken = {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  symbol: 'USDC',
  decimals: 6,
  value: '',
}

export const WBTC_MAINNET: TradingToken = {
  address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  symbol: 'WBTC',
  decimals: 8,
  value: '',
}

export const USDT_MAINNET: TradingToken = {
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  symbol: 'USDT',
  decimals: 6,
  value: '',
}
