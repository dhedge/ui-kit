import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js'

import { decodeAbiParameters, encodeAbiParameters } from 'viem'

import type {
  Address,
  Hash,
  Hex,
  OracleAdapter,
  PublicClient,
} from 'core-kit/types'

export class PythAdapter implements OracleAdapter {
  private readonly connection: EvmPriceServiceConnection
  constructor(endpoint: string) {
    this.connection = new EvmPriceServiceConnection(endpoint)
  }

  getOracleId(): string {
    return 'PYTH'
  }

  async fetchOffchainData(
    _client: PublicClient | undefined,
    _oracleContract: Address,
    oracleQuery: Array<{ query: Hex; fee?: bigint }> | undefined,
  ): Promise<Array<{ arg: Hex; fee: bigint }>> {
    // divide by update type
    const stalePriceIds: Hash[] = []
    let stalenessTolerance: bigint = BigInt(86400)
    let staleUpdateFee: bigint = BigInt(0)
    const vaaUpdatePrices: Array<{ arg: Hex; fee: bigint }> = []
    for (const query of oracleQuery ?? []) {
      const [updateType] = decodeAbiParameters(
        [{ name: 'updateType', type: 'uint8' }],
        query.query,
      )
      if (updateType === 1) {
        const [, stalenessOrTime, priceIds] = decodeAbiParameters(
          [
            { name: 'updateType', type: 'uint8' },
            { name: 'stalenessTolerance', type: 'uint64' },
            { name: 'priceIds', type: 'bytes32[]' },
          ],
          query.query,
        )
        stalePriceIds.push(...priceIds)
        stalenessTolerance =
          stalenessOrTime < stalenessTolerance
            ? stalenessOrTime
            : stalenessTolerance
        staleUpdateFee = staleUpdateFee + (query.fee ?? BigInt(1))
      } else if (updateType === 2) {
        const [, requestedTime, priceId] = decodeAbiParameters(
          [
            { name: 'updateType', type: 'uint8' },
            { name: 'requestedTime', type: 'uint64' },
            { name: 'priceIds', type: 'bytes32' },
          ],
          query.query,
        )

        const [priceFeedUpdateVaa] = await this.connection.getVaa(
          priceId as string,
          Number((requestedTime as unknown as bigint).toString()),
        )

        const priceFeedUpdate =
          '0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')

        vaaUpdatePrices.push({
          arg: encodeAbiParameters(
            [
              { type: 'uint8', name: 'updateType' },
              { type: 'uint64', name: 'timestamp' },
              { type: 'bytes32[]', name: 'priceIds' },
              { type: 'bytes[]', name: 'updateData' },
            ],
            [2, requestedTime, [priceId], [priceFeedUpdate as Address]],
          ),
          fee: query.fee ?? BigInt(1),
        })
      } else {
        throw new Error(`update type ${updateType} not supported`)
      }
    }

    if (stalePriceIds.length > 0) {
      const updateData = (await this.connection.getPriceFeedsUpdateData(
        stalePriceIds as string[],
      )) as unknown as Address[]

      const stalePriceCall = encodeAbiParameters(
        [
          { type: 'uint8', name: 'updateType' },
          { type: 'uint64', name: 'stalenessTolerance' },
          { type: 'bytes32[]', name: 'priceIds' },
          { type: 'bytes[]', name: 'updateData' },
        ],
        [1, stalenessTolerance, stalePriceIds, updateData],
      )

      return [{ arg: stalePriceCall, fee: staleUpdateFee }, ...vaaUpdatePrices]
    } else {
      return vaaUpdatePrices
    }
  }
}
