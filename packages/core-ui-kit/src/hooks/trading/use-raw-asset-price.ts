import { PoolFactoryAbi } from 'abi'
import {
  useReadContracts,
  useContractReadsErrorLogging,
  useNetwork,
  useInvalidateOnBlock,
} from 'hooks/web3'
import type { ChainId, PoolContractCallParams } from 'types/web3.types'
import { getContractAddressById, isZeroAddress } from 'utils'

type AssetPriceParams = PoolContractCallParams & {
  chainId: ChainId
  watch?: boolean
  disabled?: boolean
}
export const useRawAssetPrice = ({
  address,
  chainId,
  watch = false,
  disabled = false,
}: AssetPriceParams): bigint | undefined => {
  const { supportedChainId } = useNetwork()

  const { data, queryKey } = useReadContracts({
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
    },
  })

  useInvalidateOnBlock({ watch, queryKey })

  useContractReadsErrorLogging(data)

  return data?.[0]?.result
}
