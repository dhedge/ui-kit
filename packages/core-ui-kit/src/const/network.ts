import { arbitrum, base, optimism, polygon } from 'wagmi/chains'

import type { ChainId, ChainNativeTokenMap } from 'types'

import { DEFAULT_PRECISION } from './default-data'

export const CHAIN_MAP = {
  [polygon.id]: polygon,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [base.id]: base,
} as const

export const CHAIN_NATIVE_TOKENS: ChainNativeTokenMap = {
  [polygon.id]: {
    nativeTokenSymbol: 'MATIC',
    wrappedNativeTokenName: 'WMATIC',
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    decimals: DEFAULT_PRECISION,
  },
  [optimism.id]: {
    nativeTokenSymbol: 'ETH',
    wrappedNativeTokenName: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    decimals: DEFAULT_PRECISION,
  },
  [arbitrum.id]: {
    nativeTokenSymbol: 'ETH',
    wrappedNativeTokenName: 'WETH',
    address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    decimals: DEFAULT_PRECISION,
  },
  [base.id]: {
    nativeTokenSymbol: 'ETH',
    wrappedNativeTokenName: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    decimals: DEFAULT_PRECISION,
  },
}

export const MAX_GAS_LIMIT_MAP: Record<ChainId, number> = {
  [polygon.id]: 29900000,
  [optimism.id]: 29900000,
  [arbitrum.id]: 29900000,
  [base.id]: 29900000,
}

export { polygon, optimism, arbitrum, base }
