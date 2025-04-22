import { PoolFactoryAbi } from 'core-kit/abi'
import {
  useContractReadsErrorLogging,
  useNetwork,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type { ChainId, PoolContractCallParams } from 'core-kit/types/web3.types'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'

type AssetPriceParams = PoolContractCallParams & {
  chainId: ChainId
  disabled?: boolean
  refetchInterval?: number
}
export const useRawAssetPrice = ({
  address,
  chainId,
  refetchInterval,
  disabled = false,
}: AssetPriceParams): bigint | undefined => {
  const { supportedChainId } = useNetwork()

  const { data } = useReadContracts({
    contracts: [
      {
        address: getContractAddressById('factory', chainId ?? supportedChainId),
        abi: PoolFactoryAbi,
        functionName: 'getAssetPrice',
        args: [address],
        chainId,
      },
    ],
    query: {
      enabled: !isZeroAddress(address) && !disabled,
      refetchInterval,
    },
  })

  useContractReadsErrorLogging(data)

  return data?.[0]?.result
}
