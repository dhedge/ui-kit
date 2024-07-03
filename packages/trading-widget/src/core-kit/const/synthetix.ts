import type { Address, ChainId } from 'core-kit/types'

import { arbitrum, base, optimism } from './network'

export const DHEDGE_SYNTHETIX_V3_ASSETS_MAP: Record<ChainId, Address> = {
  [optimism.id]: '0xffffffaeff0b96ea8e4f94b2253f31abdd875847',
  [base.id]: '0x32C222A9A159782aFD7529c87FA34b96CA72C696',
  [arbitrum.id]: '0xffffffaeff0b96ea8e4f94b2253f31abdd875847',
}

export const DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES: Address[] = [
  '0x90fd55a7ef1af647e93ae96a17bcb3b6a2df0e02', // DNY3 Optimism
  '0xc1e02884af4a283ca25ab63c45360d220d69da52', // Synthetix USDC Yield Base
  '0xc3198eb5102fb3335c0e911ef1da4bc07e403dd1', // Synthetix USD Yield Arbitrum
]

export const SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS: Record<string, string[]> = {
  '0xc1e02884af4a283ca25ab63c45360d220d69da52': [
    '170141183460469231731687303715884105982', // Synthetix USDC Yield Base ID
    '1',
    '0xC74eA762cF06c9151cE074E6a569a5945b6302E7',
  ],
  '0xc3198eb5102fb3335c0e911ef1da4bc07e403dd1': [
    '170141183460469231731687303715884106252', // Synthetix USD Yield Arbitrum ID
    '1',
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  ],
}
