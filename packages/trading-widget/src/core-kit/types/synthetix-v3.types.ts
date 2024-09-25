import type {
  Address,
  Hex,
  PublicClient,
  TransactionRequest,
} from 'core-kit/types/web3.types'

export interface OracleAdapter {
  getOracleId: () => string
  fetchOffchainData: (
    client: PublicClient | undefined,
    oracleContract: Address,
    oracleQuery: Array<{ query: Hex; fee: bigint }> | undefined,
  ) => Promise<Array<{ arg: Hex; fee?: bigint }>>
}

export interface Batcher {
  batchable: (
    client: PublicClient,
    transactions: TransactionRequest[],
  ) => Promise<boolean>
  batch: (transactions: TransactionRequest[]) => TransactionRequest
}
