import BigNumber from 'bignumber.js'
import type { Address } from 'viem'
import { useReadContracts } from 'wagmi'

import type { ChainId } from 'core-kit/types'
import { ChainlinkOracleAbi } from 'limit-orders/constants/abi/chainlink-oracle-abi'
import { isChainlinkOracleAddress } from 'limit-orders/constants/chainlink-oracles'

interface UseChainlinkAssetPriceParams {
  address: Address
  chainId: ChainId
}

export const useChainlinkAssetPrice = ({
  address,
  chainId,
}: UseChainlinkAssetPriceParams) =>
  useReadContracts({
    contracts: [
      { address, chainId, abi: ChainlinkOracleAbi, functionName: 'decimals' },
      {
        address,
        chainId,
        abi: ChainlinkOracleAbi,
        functionName: 'latestAnswer',
      },
    ],
    query: {
      enabled: isChainlinkOracleAddress(address),
      select: (data) => {
        const [decimals, latestAnswer] = data.map(({ result }) => result)

        if (!decimals || !latestAnswer) {
          return '0'
        }

        return new BigNumber(latestAnswer)
          .shiftedBy(-Number(decimals))
          .toFixed()
      },
    },
  })
