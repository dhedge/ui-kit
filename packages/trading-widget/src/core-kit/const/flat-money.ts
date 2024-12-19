import { base } from './network'
import type { Address, ChainId } from '../types'

export const FLATMONEY_LEVERAGED_ASSET_MAP: Record<ChainId, Address> = {
  [base.id]: '0xdb0cd65dcc7fe07003ce1201f91e1f966fa95768',
}

export const FLATMONEY_COLLATERAL_ADDRESS_MAP: Record<ChainId, Address> = {
  [base.id]: '0xb6fe221fe9eef5aba221c348ba20a1bf5e73624c', // rETH
}

export const FLATMONEY_COLLATERAL_SYMBOL_MAP: Record<ChainId, string> = {
  [base.id]: 'rETH',
}

export const FLATMONEY_UNIT_SYMBOL_MAP: Record<ChainId, string> = {
  [base.id]: 'UNIT',
}

export const FLATMONEY_UNIT_ADDRESS_MAP: Record<ChainId, Address> = {
  [base.id]: '0xb95fb324b8a2faf8ec4f76e3df46c718402736e2',
}
