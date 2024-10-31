import type { Address, ChainId } from 'core-kit/types/web3.types'

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
  | 'oraclesUpdate'
  | 'swap'
  | 'claim'
  | 'single_withdraw_and_claim'

export type SwapEntity = 'token' | 'pool'

export interface TokenSelectorPayload {
  isOpen: boolean
  entity: SwapEntity
}

export type ApyCurrency = 'USD' | 'ETH'

export interface UseProjectedEarningsResult {
  dailyEarnings: string | null
  monthlyEarnings: string | null
  yearlyEarnings: string | null
  showEarnings: boolean
}
