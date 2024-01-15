import type { TradingToken } from 'types'

import { BRIDGED_USDC_ARBITRUM } from './arbitrum'
import { BRIDGED_USDC_OPTIMISM } from './optimism'
import { BRIDGED_USDC_POLYGON } from './polygon'
import { DEFAULT_PRECISION } from '../default-data'
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
