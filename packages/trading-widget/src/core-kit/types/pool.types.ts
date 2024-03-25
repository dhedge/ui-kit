import type { Address } from 'core-kit/types/web3.types'

export interface PoolComposition {
  tokenName: string
  rate: string
  amount: string
  isDeposit: boolean
  tokenAddress: Address
  precision: number
  asset: {
    iconSymbols: string[]
  }
}

export interface PoolCompositionWithFraction extends PoolComposition {
  fraction: string
  fractionUsd: string
}
