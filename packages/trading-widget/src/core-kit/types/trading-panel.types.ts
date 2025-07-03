import type { Address, ChainId, Hex } from 'core-kit/types/web3.types'

export interface TradingToken {
  address: Address
  symbol: string
  value: string
  decimals: number
}

export interface DynamicTradingToken extends TradingToken {
  isLoading?: boolean
}

export type TradingModalStatus = 'Success' | 'None' | 'Mining' | 'Wallet'

export interface PendingTransaction {
  action: TransactionAction
  symbol: string
  chainId: ChainId
  txHash?: Address
  batchId?: Hex
}

type AddTransaction = { type: 'add' } & PendingTransaction
type UpdateTransaction = {
  type: 'update'
} & Partial<PendingTransaction>
type RemoveTransaction = {
  type: 'remove'
  status: 'success' | 'fail'
} & Partial<PendingTransaction>
export type UpdateTransactionsArguments =
  | AddTransaction
  | UpdateTransaction
  | RemoveTransaction

export type TradingPanelType = 'deposit' | 'withdraw'
export type TransactionAction =
  | 'deposit'
  | 'multi_withdraw'
  | 'single_withdraw'
  | 'approve'
  | 'swap'
  | 'claim'
  | 'single_withdraw_and_claim'
  | 'create_limit_sell_order'

export type SwapEntity = 'token' | 'pool'

export interface TokenSelectorPayload {
  isOpen: boolean
  entity: SwapEntity
}

export type ApyCurrency = 'USD' | 'ETH' | 'BTC'

export interface UseProjectedEarningsResult {
  dailyEarnings: string | null
  monthlyEarnings: string | null
  yearlyEarnings: string | null
  showEarnings: boolean
}
