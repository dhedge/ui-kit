import type { Address, ChainId } from 'core-kit/types'

import { arbitrum, base, optimism } from './network'

export const DHEDGE_SYNTHETIX_V3_ASSETS_MAP: Record<ChainId, Address> = {
  [optimism.id]: '0xffffffaeff0b96ea8e4f94b2253f31abdd875847',
  [base.id]: '0x32C222A9A159782aFD7529c87FA34b96CA72C696',
  [arbitrum.id]: '0xffffffaeff0b96ea8e4f94b2253f31abdd875847',
}

export const DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES: Address[] = []

// Should include symbols for all vaults from DHEDGE_SYNTHETIX_V3_VAULT_ADDRESSES
export const SYNTHETIX_V3_VAULTS_WITHDRAW_ASSET_SYMBOL_MAP: Record<
  string,
  string
> = {}

export const SYNTHETIX_V3_POSITION_DEBT_ARGUMENTS: Record<string, string[]> = {
  '0xc1e02884af4a283ca25ab63c45360d220d69da52': [
    '170141183460469231731687303715884105982', // Synthetix USDC Yield Base ID
    '1',
    '0xC74eA762cF06c9151cE074E6a569a5945b6302E7',
  ],
}

export const WITHDRAWAL_FEE_MAP = new Map<Address, number>([
  ['0x7d3c9c6566375d7ad6e89169ca5c01b5edc15364', 0.5], // SOLBULL2X_OPTIMISM
  ['0xcc7d6ed524760539311ed0cdb41d0852b4eb77eb', 0.9], // SOLBULL3X_OPTIMISM
  ['0x49bdb78f48db6e0ced4d4475b6d2047539df1412', 0.4], // DOGEBULL2X_OPTIMISM
  ['0x1bae4efc60269fe66ecec7252825d6a0250a02ee', 1], // SUIBULL2X_OPTIMISM
])
