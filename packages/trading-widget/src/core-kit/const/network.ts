import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains'

import type { ChainId, ChainNativeTokenMap } from 'core-kit/types'

import { DEFAULT_PRECISION } from './default-data'

export const CHAIN_MAP = {
  [mainnet.id]: mainnet,
  [polygon.id]: polygon,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [base.id]: base,
} as const

export const CHAIN_NATIVE_TOKENS: ChainNativeTokenMap = {
  [mainnet.id]: {
    nativeTokenSymbol: 'ETH',
    wrappedNativeTokenName: 'WETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: DEFAULT_PRECISION,
  },
  [polygon.id]: {
    nativeTokenSymbol: 'POL',
    wrappedNativeTokenName: 'WPOL',
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
  [mainnet.id]: 29900000,
  [polygon.id]: 29900000,
  [optimism.id]: 29900000,
  [arbitrum.id]: 29900000,
  [base.id]: 29900000,
}

export const ALCHEMY_RPC_URL_MAP: Record<number, string> = {
  [mainnet.id]: 'https://eth-mainnet.g.alchemy.com/v2',
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2`,
  [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2`,
} as const

export { polygon, optimism, arbitrum, base, mainnet }
