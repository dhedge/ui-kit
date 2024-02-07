import { PoolFactoryAbi, PoolLogicAbi } from 'abi'
import { AddressZero } from 'const'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'hooks/web3'
import type {
  MulticallReturnType,
  PoolContractAccountCallParams,
  PoolContractCallParams,
} from 'types'
import { getContractAddressById, isZeroAddress } from 'utils'

const getContracts = ({
  address,
  chainId,
  account,
}: PoolContractAccountCallParams) =>
  [
    {
      address: getContractAddressById('factory', chainId),
      abi: PoolFactoryAbi,
      functionName: 'isPool',
      chainId,
      args: [address],
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'isMemberAllowed',
      args: [account ?? AddressZero],
      chainId,
    },
    {
      address: address ?? AddressZero,
      abi: PoolLogicAbi,
      functionName: 'poolManagerLogic',
      chainId,
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  isPool: data[0].result,
  isMemberAllowed: data[1].result,
  poolManagerLogic: data[2].result,
})

export const usePoolStatic = ({ address, chainId }: PoolContractCallParams) => {
  const { account = AddressZero } = useAccount()

  const result = useReadContracts({
    contracts: getContracts({ address, chainId, account }),
    query: {
      enabled: !!address && !isZeroAddress(address),
      staleTime: Infinity,
      select: selector,
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
