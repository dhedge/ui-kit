import { EasySwapperV2Abi, PoolFactoryAbi, PoolLogicAbi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useReadContracts } from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractCallParams,
} from 'core-kit/types'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'

const getContracts = ({ address, chainId }: PoolContractCallParams) =>
  [
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
    {
      address: getContractAddressById('factory', chainId),
      chainId,
      abi: PoolFactoryAbi,
      functionName: 'getAssetGuard',
      args: [getContractAddressById('aaveLendingPoolV3', chainId)],
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  poolManagerLogic: data[0].result,
  isCustomCooldownDepositAllowed: data[1].result,
  customCooldown: data[2].result,
  aaveAssetGuardAddress: data[3].result,
})

export const usePoolStatic = ({ address, chainId }: PoolContractCallParams) =>
  useReadContracts({
    contracts: getContracts({ address, chainId }),
    query: {
      enabled: !!address && !isZeroAddress(address),
      staleTime: Infinity,
      select: selector,
    },
  })
