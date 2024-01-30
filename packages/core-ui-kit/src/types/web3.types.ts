import type {
  Address,
  Chain,
  TransactionRequest as ViemTransactionRequest,
} from 'viem'

export type { UseWriteContractParameters } from 'wagmi'
export type {
  Hex,
  PublicClient,
  WalletClient,
  Client,
  WaitForTransactionReceiptReturnType,
  CallExecutionError,
} from 'viem'
export type { Address, Chain }
export type ChainId = Chain['id']
export type TransactionRequest = Pick<
  ViemTransactionRequest,
  'to' | 'data' | 'value' | 'from'
>

export type ContractActionFunc = () => Promise<void | unknown> // TODO: check

export interface EstimatedGas {
  value: bigint
  error: string
}
export type EstimateCall = (...args: unknown[]) => Promise<EstimatedGas>

export interface SendEstimationResult {
  argsToUse: unknown[]
  gas: bigint
}

export interface ContractCallArgs<T extends string | undefined | void> {
  getOrderedArgs: (extraArg: T) => string[]
}

export interface SimulateTransactionParams {
  chainId: ChainId
  from: string
  to: string
  input: string
  gas: number
  value?: string
}

export interface SimulateTransactionResponse {
  link?: string
  simulation: { status: boolean; error_message: string }
}

export interface PoolContractCallParams {
  address: Address
  chainId?: ChainId
}
