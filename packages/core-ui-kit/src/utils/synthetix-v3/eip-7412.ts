import { IERC7412Abi } from 'abi'
import { AddressZero } from 'const'
import type {
  Address,
  Batcher,
  CallExecutionError,
  Hex,
  OracleAdapter,
  PublicClient,
  TransactionRequest,
} from 'types'

import { parseError } from './parse-error'
import {
  decodeErrorResult,
  encodeFunctionData,
  hexToString,
  trim,
} from '../web3'

// we do a looser checkSupport for TrustedMulticallForwarderBatcher batcher; not necessary to do the on-chain read requests;
// modified from: https://github.com/Synthetixio/erc7412/pull/10
export class Eip7412 {
  oracleAdapters: Map<string, OracleAdapter>
  batcher: Batcher

  constructor(oracleAdapters: OracleAdapter[], batcher: Batcher) {
    this.oracleAdapters = new Map(
      oracleAdapters?.map((adapter) => [adapter.getOracleId(), adapter]),
    )
    this.batcher = batcher
  }

  // Returns a list of transactions for submission to a paymaster or otherwise.
  async buildTransactions(
    client: PublicClient,
    transactions: TransactionRequest | TransactionRequest[],
  ): Promise<TransactionRequest[]> {
    return await (this.enableERC7412(client, transactions, true) as Promise<
      TransactionRequest[]
    >)
  }

  // Returns a multicall using the best method available for the provided transactions.
  async buildTransaction(
    client: PublicClient,
    transactions: TransactionRequest | TransactionRequest[],
  ): Promise<TransactionRequest> {
    return await (this.enableERC7412(
      client,
      transactions,
      false,
    ) as Promise<TransactionRequest>)
  }

  async batch(
    _client: PublicClient,
    transactions: TransactionRequest[],
  ): Promise<TransactionRequest> {
    return this.batcher.batch(transactions)
  }

  async enableERC7412(
    client: PublicClient,
    tx: TransactionRequest | TransactionRequest[],
    returnList?: boolean,
  ): Promise<TransactionRequest | TransactionRequest[]> {
    const multicallCalls: TransactionRequest[] = Array.isArray(tx) ? tx : [tx]

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        if (multicallCalls.length === 1 && multicallCalls[0]) {
          await client.call(multicallCalls[0])
          return multicallCalls[0]
        } else {
          const multicallTxn = await this.batch(client, multicallCalls)
          await client.call(multicallTxn)
          return returnList ? multicallCalls : multicallTxn
        }
      } catch (error) {
        const err = decodeErrorResult({
          abi: IERC7412Abi,
          data: parseError(error as CallExecutionError),
        })
        if (err.errorName === 'OracleDataRequired') {
          const oracleQuery = err.args![1] as Hex
          const oracleAddress = err.args![0] as Address

          const oracleId = hexToString(
            trim(
              (await client.readContract({
                abi: IERC7412Abi,
                address: oracleAddress,
                functionName: 'oracleId',
                args: [],
              })) as Hex,
              { dir: 'right' },
            ),
          )

          const adapter = this.oracleAdapters.get(oracleId)
          if (adapter === undefined) {
            throw new Error(
              `oracle ${oracleId} not supported (supported oracles: ${Array.from(
                this.oracleAdapters.keys(),
              ).join(',')})`,
            )
          }

          const signedRequiredData = await adapter.fetchOffchainData(
            client,
            oracleAddress,
            oracleQuery,
          )

          multicallCalls.splice(multicallCalls.length - 1, 0, {
            from:
              multicallCalls[multicallCalls.length - 1]?.from ?? AddressZero,
            to: err.args![0] as Address,
            data: encodeFunctionData({
              abi: IERC7412Abi,
              functionName: 'fulfillOracleQuery',
              args: [signedRequiredData],
            }),
          })
        } else if (err.errorName === 'FeeRequired') {
          const requiredFee = err.args![0] as bigint
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          multicallCalls[multicallCalls.length - 2].value = requiredFee
        } else {
          throw error
        }
      }
    }
  }
}
