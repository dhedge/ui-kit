import type { PoolComposition } from 'core-kit/types/pool.types'
import type {
  ApyCurrency,
  TradingToken,
} from 'core-kit/types/trading-panel.types'
import type { Address, ChainId } from 'core-kit/types/web3.types'

export interface PoolConfig {
  address: Address
  symbol: string
  chainId: ChainId
  depositParams: {
    customTokens: TradingToken[]
    defaultDepositTokenSymbol?: string
  }
  withdrawParams: {
    customTokens: TradingToken[]
  }
  deprecated?: boolean
  isCustomCooldownDeposit?: boolean
}

export interface PoolFallbackData {
  address: Address
  managerLogicAddress?: Address
  poolCompositions?: PoolComposition[]
  tokenPrice?: string
  apy?: {
    value: number
    currency: ApyCurrency
  }
  performanceFeeNumerator?: string | null
  streamingFeeNumerator?: string | null
  entryFeeNumerator?: string | null
  exitFeeNumerator?: string | null
}
