import type {
  Address,
  Client,
  Hex,
  PublicClient,
  TransactionRequest,
} from 'types/web3.types'

export interface OracleAdapter {
  getOracleId: () => string
  fetchOffchainData: (
    client: Client,
    oracleContract: Address,
    oracleQuery: Hex,
  ) => Promise<Hex>
}

export interface Batcher {
  batchable: (
    client: PublicClient,
    transactions: TransactionRequest[],
  ) => Promise<boolean>
  batch: (transactions: TransactionRequest[]) => TransactionRequest
}
