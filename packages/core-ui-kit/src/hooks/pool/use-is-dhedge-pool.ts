import { PoolFactoryAbi } from 'abi'
import { AddressZero } from 'const'
import { useReadContracts, useContractReadsErrorLogging } from 'hooks/web3'
import type { Address, ChainId } from 'types'
import { getContractAddressById } from 'utils'

export const useIsDhedgePool = ({
  address = AddressZero,
  chainId,
}: {
  address?: Address
  chainId: ChainId
}) => {
  const { data } = useReadContracts({
    contracts: [
      {
        address: getContractAddressById('factory', chainId),
        abi: PoolFactoryAbi,
        functionName: 'isPool',
        chainId,
        args: [address],
      },
    ],
    query: {
      enabled: address !== AddressZero && !!chainId,
      staleTime: Infinity,
    },
  })
  useContractReadsErrorLogging(data)

  return !!data?.[0]?.result
}
