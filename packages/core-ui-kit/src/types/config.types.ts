import type { PoolComposition } from 'types/pool.types'
import type {
  DepositMethodName,
  TradingToken,
  WithdrawTradingToken,
} from 'types/trading-panel.types'
import type { Address, ChainId } from 'types/web3.types'

export interface PoolConfig {
  address: Address
  symbol: string
  chainId: ChainId
  depositParams: {
    method?: DepositMethodName
    customTokens: TradingToken[]
    defaultDepositTokenSymbol?: string
  }
  withdrawParams: {
    method?: string
    customTokens: WithdrawTradingToken[]
  }
  deprecated?: boolean
}

export interface PoolFallbackData {
  address: Address
  managerLogicAddress?: Address
  poolCompositions?: PoolComposition[]
  tokenPrice?: string
}
