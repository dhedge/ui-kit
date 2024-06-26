import {
  DhedgeEasySwapperAbi,
  PoolFactoryAbi,
  PoolLogicAbi,
} from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractAccountCallParams,
  PoolContractCallParams,
} from 'core-kit/types'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'

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
    {
      address: getContractAddressById('easySwapper', chainId),
      abi: DhedgeEasySwapperAbi,
      functionName: 'allowedPools',
      args: [address],
      chainId,
    },
    {
      address: getContractAddressById('easySwapper', chainId),
      abi: DhedgeEasySwapperAbi,
      functionName: 'feeNumerator',
      chainId,
    },
    {
      address: getContractAddressById('easySwapper', chainId),
      abi: DhedgeEasySwapperAbi,
      functionName: 'feeDenominator',
      chainId,
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  isPool: data[0].result,
  isMemberAllowed: data[1].result,
  poolManagerLogic: data[2].result,
  easySwapperAllowedPools: data[3].result,
  easySwapperFeeNumerator: data[4].result,
  easySwapperFeeDenominator: data[5].result,
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
