import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js'
import type { Address, Client, Hex } from 'viem'
import { decodeAbiParameters, encodeAbiParameters } from 'viem'

interface Adapter {
  getOracleId(): string
  fetchOffchainData(
    client: Client,
    oracleContract: Address,
    oracleQuery: Hex,
  ): Promise<Hex>
}

export class PythAdapter implements Adapter {
  private connection: EvmPriceServiceConnection
  constructor(endpoint: string) {
    this.connection = new EvmPriceServiceConnection(endpoint)
  }

  getOracleId(): string {
    return 'PYTH'
  }

  async fetchOffchainData(
    _client: Client,
    _requester: Address,
    data: Hex,
  ): Promise<Hex> {
    const [updateType] = decodeAbiParameters(
      [{ name: 'updateType', type: 'uint8' }],
      data,
    )

    if (updateType === 1) {
      const [updateType, stalenessOrTime, priceIds] = decodeAbiParameters(
        [
          { name: 'updateType', type: 'uint8' },
          { name: 'stalenessTolerance', type: 'uint64' },
          { name: 'priceIds', type: 'bytes32[]' },
        ],
        data,
      )

      const stalenessTolerance = stalenessOrTime
      const updateData = (await this.connection.getPriceFeedsUpdateData(
        priceIds as string[],
      )) as unknown as Address[]

      return encodeAbiParameters(
        [
          { type: 'uint8', name: 'updateType' },
          { type: 'uint64', name: 'stalenessTolerance' },
          { type: 'bytes32[]', name: 'priceIds' },
          { type: 'bytes[]', name: 'updateData' },
        ],
        [updateType, stalenessTolerance, priceIds, updateData],
      )
    } else if (updateType === 2) {
      const [updateType, requestedTime, priceId] = decodeAbiParameters(
        [
          { name: 'updateType', type: 'uint8' },
          { name: 'requestedTime', type: 'uint64' },
          { name: 'priceIds', type: 'bytes32' },
        ],
        data,
      )

      const [priceFeedUpdateVaa] = await this.connection.getVaa(
        priceId as string,
        Number((requestedTime as unknown as bigint).toString()),
      )

      const priceFeedUpdate =
        '0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')

      return encodeAbiParameters(
        [
          { type: 'uint8', name: 'updateType' },
          { type: 'uint64', name: 'timestamp' },
          { type: 'bytes32[]', name: 'priceIds' },
          { type: 'bytes[]', name: 'updateData' },
        ],
        [updateType, requestedTime, [priceId], [priceFeedUpdate as Address]],
      )
    } else {
      throw new Error(`update type ${updateType} not supported`)
    }
  }
}
