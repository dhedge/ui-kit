import { base } from './network'
import type { Address, ChainId } from '../types'

export const FLATMONEY_LEVERAGED_RETH_ASSET_MAP: Record<ChainId, Address> = {
  [base.id]: '0xdb0cd65dcc7fe07003ce1201f91e1f966fa95768',
}

export const FLATMONEY_COLLATERAL_SYMBOL_MAP: Record<ChainId, string> = {
  [base.id]: 'rETH',
}
