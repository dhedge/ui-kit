import type { Address } from 'core-kit/types'

export interface ContractStakeData {
  dhedgePoolAddress: Address
  dhedgePoolAmount: bigint
  unstaked: boolean
}
