import type { Address } from 'core-kit/types'

export const WITHDRAWAL_FEE_MAP = new Map<Address, number>([
  ['0x7d3c9c6566375d7ad6e89169ca5c01b5edc15364', 0.5], // SOLBULL2X_OPTIMISM
  ['0xcc7d6ed524760539311ed0cdb41d0852b4eb77eb', 0.9], // SOLBULL3X_OPTIMISM
  ['0x49bdb78f48db6e0ced4d4475b6d2047539df1412', 0.4], // DOGEBULL2X_OPTIMISM
  ['0x1bae4efc60269fe66ecec7252825d6a0250a02ee', 1], // SUIBULL2X_OPTIMISM
])
