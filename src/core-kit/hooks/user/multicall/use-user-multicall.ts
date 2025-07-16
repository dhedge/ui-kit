import { EasySwapperV2Abi, PoolFactoryAbi } from 'core-kit/abi'
import { useReadContracts } from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractCallParams,
} from 'core-kit/types'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'

const getContracts = ({ address, chainId }: PoolContractCallParams) =>
  [
    {
      address: getContractAddressById('factory', chainId),
      abi: PoolFactoryAbi,
      functionName: 'isPool',
      chainId,
      args: [address],
    },
    {
      address: getContractAddressById('easySwapperV2', chainId),
      abi: EasySwapperV2Abi,
      functionName: 'withdrawalContracts',
      args: [address],
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  isUserDhedgePool: data[0].result,
  withdrawalContractAddress: data[1].result,
})

export const useUserMulticall = ({
  address,
  chainId,
}: PoolContractCallParams) =>
  useReadContracts({
    contracts: getContracts({ address, chainId }),
    query: {
      enabled: !isZeroAddress(address),
      select: selector,
    },
  })
