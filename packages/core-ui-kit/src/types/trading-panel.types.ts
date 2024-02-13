import type { Address, ChainId } from 'types/web3.types'

export interface TradingToken {
  address: Address
  symbol: string
  value: string
  decimals: number
}

export interface DynamicTradingToken extends TradingToken {
  isLoading?: boolean
}

export interface WithdrawTradingToken extends TradingToken {
  method?: WithdrawMethodName
  intermediateToken?: TradingToken
}

export type TradingModalStatus = 'Success' | 'None' | 'Mining' | 'Wallet'

export interface PendingTransaction {
  action: 'deposit' | 'withdraw' | 'approve'
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
  | 'withdraw'
  | 'approve'
  | 'oraclesUpdate'

export type DepositMethodName = 'deposit' | 'depositWithCustomCooldown'

export type WithdrawMethodName = 'withdraw' | 'withdrawSUSD'

export type SwapEntity = 'token' | 'pool'

export interface TokenSelectorPayload {
  isOpen: boolean
  entity: SwapEntity
}

export type ApyCurrency = 'USD' | 'ETH'
