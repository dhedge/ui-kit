import type { TradingToken } from 'core-kit/types'

import { BRIDGED_USDC_ARBITRUM, WETH_ARBITRUM } from './arbitrum'
import { WETH_BASE } from './base'
import { BRIDGED_USDC_OPTIMISM, WETH_OPTIMISM } from './optimism'
import { BRIDGED_USDC_POLYGON, WETH_POLYGON } from './polygon'
import { DEFAULT_PRECISION } from '../default-data'
import { arbitrum, base, optimism, polygon } from '../network'
import { AddressZero } from '../web3'

export * from './arbitrum'
export * from './base'
export * from './optimism'
export * from './polygon'

export const MULTI_ASSET_TOKEN: TradingToken = {
  address: AddressZero,
  symbol: 'all',
  decimals: DEFAULT_PRECISION,
  value: '',
}

export const BRIDGED_TOKENS_SYMBOLS: Record<string, string> = {
  [BRIDGED_USDC_ARBITRUM.address.toLowerCase()]: 'USDCe',
  [BRIDGED_USDC_OPTIMISM.address.toLowerCase()]: 'USDCe',
  [BRIDGED_USDC_POLYGON.address.toLowerCase()]: 'USDCe',
}

export const WETH_BY_CHAIN_ID: Record<number, TradingToken> = {
  [optimism.id]: WETH_OPTIMISM,
  [base.id]: WETH_BASE,
  [polygon.id]: WETH_POLYGON,
  [arbitrum.id]: WETH_ARBITRUM,
}
