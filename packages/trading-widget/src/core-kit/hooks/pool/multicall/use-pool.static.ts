import { EasySwapperV2Abi, PoolFactoryAbi, PoolLogicAbi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import {
  useContractReadErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
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
      address: address ?? AddressZero,
      abi: PoolLogicAbi,
      functionName: 'poolManagerLogic',
      chainId,
    },
    {
      address: getContractAddressById('easySwapperV2', chainId),
      abi: EasySwapperV2Abi,
      functionName: 'customCooldownDepositsWhitelist',
      args: [address],
      chainId,
    },
    {
      address: getContractAddressById('easySwapperV2', chainId),
      abi: EasySwapperV2Abi,
      functionName: 'customCooldown',
      args: [],
      chainId,
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  isPool: data[0].result,
  poolManagerLogic: data[1].result,
  isCustomCooldownDepositAllowed: data[2].result,
  customCooldown: data[3].result,
})

export const usePoolStatic = ({ address, chainId }: PoolContractCallParams) => {
  const result = useReadContracts({
    contracts: getContracts({ address, chainId }),
    query: {
      enabled: !!address && !isZeroAddress(address),
      staleTime: Infinity,
      select: selector,
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
