import { PoolFactoryAbi } from 'abi'
import {
  useContractReads,
  useContractReadsErrorLogging,
  useNetwork,
} from 'hooks/web3'
import type { ChainId, PoolContractCallParams } from 'types/web3.types'
import { getContractAddressById, isZeroAddress } from 'utils'

type AssetPriceParams = PoolContractCallParams & {
  chainId: ChainId
  watch?: boolean
}
export const useRawAssetPrice = ({
  address,
  chainId,
  watch = false,
}: AssetPriceParams): bigint | undefined => {
  const { supportedChainId } = useNetwork()

  const { data } = useContractReads({
    contracts: [
      {
        address: getContractAddressById('factory', chainId ?? supportedChainId),
        abi: PoolFactoryAbi,
        functionName: 'getAssetPrice',
        args: [address],
        chainId,
      },
    ],
    enabled: !isZeroAddress(address),
    watch,
  })
  useContractReadsErrorLogging(data)

  return data?.[0]?.result
}
