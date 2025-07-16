import { DEFAULT_PRECISION } from 'core-kit/const/default-data'
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
} from 'core-kit/const/network'
import {
  BRIDGED_USDC_ARBITRUM,
  USDC_ARBITRUM,
  WBTC_ARBITRUM,
  WETH_ARBITRUM,
} from 'core-kit/const/tokens/arbitrum'
import { CBBTC_BASE, USDC_BASE, WETH_BASE } from 'core-kit/const/tokens/base'
import {
  USDC_MAINNET,
  USDT_MAINNET,
  WBTC_MAINNET,
  WETH_MAINNET,
} from 'core-kit/const/tokens/mainnet'
import {
  BRIDGED_USDC_OPTIMISM,
  DAI_OPTIMISM,
  USDC_OPTIMISM,
  USDT_OPTIMISM,
  WBTC_OPTIMISM,
  WETH_OPTIMISM,
} from 'core-kit/const/tokens/optimism'
import {
  BRIDGED_USDC_POLYGON,
  DAI_POLYGON,
  USDC_POLYGON,
  USDT_POLYGON,
  WBTC_POLYGON,
  WETH_POLYGON,
  WPOL_POLYGON,
} from 'core-kit/const/tokens/polygon'
import { AddressZero } from 'core-kit/const/web3'
import type { ChainId, TradingToken } from 'core-kit/types'

export * from 'core-kit/const/tokens/arbitrum'
export * from 'core-kit/const/tokens/base'
export * from 'core-kit/const/tokens/optimism'
export * from 'core-kit/const/tokens/polygon'
export * from 'core-kit/const/tokens/mainnet'

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
  [mainnet.id]: WETH_MAINNET,
  [optimism.id]: WETH_OPTIMISM,
  [base.id]: WETH_BASE,
  [polygon.id]: WETH_POLYGON,
  [arbitrum.id]: WETH_ARBITRUM,
}

export const WBTC_BY_CHAIN_ID: Record<number, TradingToken> = {
  [optimism.id]: WBTC_OPTIMISM,
  [base.id]: CBBTC_BASE,
  [polygon.id]: WBTC_POLYGON,
  [arbitrum.id]: WBTC_ARBITRUM,
  [mainnet.id]: WBTC_MAINNET,
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
    WMATIC: WPOL_POLYGON,
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
  [mainnet.id]: {
    WETH: WETH_MAINNET,
    USDC: USDC_MAINNET,
    WBTC: WBTC_MAINNET,
    USDT: USDT_MAINNET,
  },
}
