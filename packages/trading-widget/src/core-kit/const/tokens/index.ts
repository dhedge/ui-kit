import type { ChainId, TradingToken } from 'core-kit/types'

import {
  BRIDGED_USDC_ARBITRUM,
  USDC_ARBITRUM,
  WBTC_ARBITRUM,
  WETH_ARBITRUM,
} from './arbitrum'
import { USDC_BASE, WETH_BASE } from './base'
import {
  BRIDGED_USDC_OPTIMISM,
  DAI_OPTIMISM,
  USDC_OPTIMISM,
  USDT_OPTIMISM,
  WBTC_OPTIMISM,
  WETH_OPTIMISM,
} from './optimism'
import {
  BRIDGED_USDC_POLYGON,
  DAI_POLYGON,
  USDC_POLYGON,
  USDT_POLYGON,
  WBTC_POLYGON,
  WETH_POLYGON,
  WMATIC_POLYGON,
} from './polygon'
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

export const FALLBACK_ASSETS_MAP: Record<
  ChainId,
  Record<string, TradingToken>
> = {
  [optimism.id]: {
    WETH: WETH_OPTIMISM,
    USDC: USDC_OPTIMISM,
    WBTC: WBTC_OPTIMISM,
    USDCe: BRIDGED_USDC_OPTIMISM,
    USDT: USDT_OPTIMISM,
    DAI: DAI_OPTIMISM,
  },
  [polygon.id]: {
    WMATIC: WMATIC_POLYGON,
    WETH: WETH_POLYGON,
    USDC: USDC_POLYGON,
    WBTC: WBTC_POLYGON,
    USDCe: BRIDGED_USDC_POLYGON,
    USDT: USDT_POLYGON,
    DAI: DAI_POLYGON,
  },
  [arbitrum.id]: {
    WETH: WETH_ARBITRUM,
    USDC: USDC_ARBITRUM,
    WBTC: WBTC_ARBITRUM,
    USDCe: BRIDGED_USDC_ARBITRUM,
  },
  [base.id]: {
    WETH: WETH_BASE,
    USDC: USDC_BASE,
  },
}
