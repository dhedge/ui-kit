import type { TradingToken } from 'types'

import { DEFAULT_PRECISION } from '../default-data'

export const BRIDGED_USDC_ARBITRUM: TradingToken = {
  address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  symbol: 'USDCe',
  decimals: 6,
  value: '',
}

export const USDC_ARBITRUM: TradingToken = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  symbol: 'USDC',
  decimals: 6,
  value: '',
}

export const WETH_ARBITRUM: TradingToken = {
  address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  symbol: 'WETH',
  decimals: DEFAULT_PRECISION,
  value: '',
}
