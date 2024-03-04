import type { Address } from '@dhedge/core-ui-kit/types'

export interface ContractStakeData {
  dhedgePoolAddress: Address
  dhedgePoolAmount: bigint
  unstaked: boolean
}
