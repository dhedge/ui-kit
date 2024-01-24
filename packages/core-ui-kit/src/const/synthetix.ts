import type { Address, ChainId } from 'types'

import { base, optimism } from './network'

export const DHEDGE_SYNTHETIX_V3_ASSETS_MAP: Record<ChainId, Address> = {
  [optimism.id]: '0xffffffaeff0b96ea8e4f94b2253f31abdd875847',
  [base.id]: '0x32C222A9A159782aFD7529c87FA34b96CA72C696',
}

export const DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES: Address[] = [
  '0x90fd55a7ef1af647e93ae96a17bcb3b6a2df0e02', // DNY3 Optimism
  '0xe404fa05a4298dc657ea826ddaeec8bd630e414a', // Synthetix USDC Yield Base
]

export const SYNTHETIX_V3_ACCOUNT_ID_MAP: Record<number, string> = {
  [base.id]: '170141183460469231731687303715884105734',
}
export const SYNTHETIX_V3_POOL_ID_MAP: Record<number, string> = {
  [base.id]: '1',
}

export const SYNTHETIX_V3_COLLATERAL_TYPE_ID_MAP: Record<number, string> = {
  [base.id]: '0xC74eA762cF06c9151cE074E6a569a5945b6302E7',
}
