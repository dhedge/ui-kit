import type { TradingToken } from 'core-kit/types'

import { DEFAULT_PRECISION } from '../default-data'

export const USDC_BASE: TradingToken = {
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  value: '',
}

export const USDCBC_BASE: TradingToken = {
  address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
  symbol: 'USDbC',
  decimals: 6,
  value: '',
}

export const WETH_BASE: TradingToken = {
  address: '0x4200000000000000000000000000000000000006',
  symbol: 'WETH',
  decimals: DEFAULT_PRECISION,
  value: '',
}
export const CBETH_BASE: TradingToken = {
  address: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22',
  symbol: 'cbETH',
  decimals: DEFAULT_PRECISION,
  value: '',
}

export const RETH_BASE: TradingToken = {
  address: '0xb6fe221fe9eef5aba221c348ba20a1bf5e73624c',
  symbol: 'rETH',
  decimals: DEFAULT_PRECISION,
  value: '',
}

export const TBTC_BASE: TradingToken = {
  address: '0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b',
  symbol: 'tBTC',
  decimals: DEFAULT_PRECISION,
  value: '',
}

export const WSTETH_BASE: TradingToken = {
  address: '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452',
  symbol: 'wstETH',
  decimals: DEFAULT_PRECISION,
  value: '',
}
