import { IERC2771ContextAbi, ITrustedMulticallForwarderAbi } from 'abi'

import { AddressZero } from 'const'
import type { Address, Batcher, PublicClient, TransactionRequest } from 'types'

import { encodeFunctionData } from '../web3'

const TRUSTED_MULTICALL_FORWARDER_ADDRESS: Address =
  '0xE2C5658cC5C448B48141168f3e475dF8f65A1e3e'

export class TrustedMulticallForwarderBatcher implements Batcher {
  isSupported: Map<Address, boolean | undefined>

  constructor() {
    this.isSupported = new Map()
  }

  async batchable(
    client: PublicClient,
    transactions: TransactionRequest[],
  ): Promise<boolean> {
    for (const transaction of transactions) {
      const toAddress = transaction.to ?? AddressZero

      // Check if the address is already known
      if (this.isSupported.has(toAddress)) {
        // If it's known and not supported, return false
        if (!this.isSupported.get(toAddress)) {
          return false
        }
      } else {
        // If the address is not known, check its support status
        const supported = await this.checkSupport(client, toAddress)
        this.isSupported.set(toAddress, supported)

        // If not supported, return false
        if (!supported) {
          return false
        }
      }
    }

    // If all addresses are supported, return true
    return true
  }

  batch(transactions: TransactionRequest[]): TransactionRequest {
    const totalValue = transactions.reduce((val, txn) => {
      return val + (txn.value ?? BigInt(0))
    }, BigInt(0))

    return {
      from: transactions[transactions.length - 1]?.from ?? AddressZero,
      to: TRUSTED_MULTICALL_FORWARDER_ADDRESS,
      value: totalValue,
      data: encodeFunctionData({
        abi: ITrustedMulticallForwarderAbi,
        functionName: 'aggregate3Value',
        args: [
          transactions.map((txn) => ({
            target: txn.to ?? AddressZero,
            callData: txn.data ?? '0x',
            value: txn.value ?? '0',
            requireSuccess: true,
          })),
        ],
      }),
    }
  }

  async checkSupport(client: PublicClient, address: Address): Promise<boolean> {
    const resp = await client.readContract({
      abi: IERC2771ContextAbi,
      address,
      functionName: 'isTrustedForwarder',
      args: [TRUSTED_MULTICALL_FORWARDER_ADDRESS],
    })

    return resp as boolean
  }
}
