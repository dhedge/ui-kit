import { PoolFactoryAbi } from 'abi'
import { AddressZero, DHEDGE_SYNTHETIX_V3_ASSETS_MAP } from 'const'
import { useReadContract, useStaticCallQuery } from 'hooks/web3'
import type { Address, ChainId } from 'types'

import {
  getContractAbiById,
  getContractAddressById,
  isEqualAddress,
} from 'utils'

interface UseSynthetixV3AssetBalanceVariables {
  vaultAddress: Address
  chainId: ChainId
  disabled?: boolean
}

export const useSynthetixV3AssetBalance = ({
  vaultAddress,
  disabled,
  chainId,
}: UseSynthetixV3AssetBalanceVariables) => {
  const synthetixV3AssetAddress =
    DHEDGE_SYNTHETIX_V3_ASSETS_MAP[chainId] ?? AddressZero
  const { data: synthetixV3AssetGuardAddress } = useReadContract({
    address: getContractAddressById('factory', chainId),
    chainId,
    abi: PoolFactoryAbi,
    functionName: 'getAssetGuard',
    args: [synthetixV3AssetAddress],
    query: {
      staleTime: Infinity,
      enabled: !disabled,
    },
  })

  const { data: mutableBalance, error: mutableBalanceError } =
    useStaticCallQuery<bigint>({
      contractId: 'synthetixV3AssetGuard',
      dynamicContractAddress: synthetixV3AssetGuardAddress ?? AddressZero,
      chainId,
      disabled:
        disabled ||
        !synthetixV3AssetGuardAddress ||
        isEqualAddress(synthetixV3AssetGuardAddress, AddressZero),
      functionName: 'getBalanceMutable',
      args: [vaultAddress, synthetixV3AssetAddress],
    })

  const { data: balance } = useReadContract({
    address: synthetixV3AssetGuardAddress ?? AddressZero,
    chainId,
    functionName: 'getBalance',
    args: [vaultAddress, synthetixV3AssetAddress],
    abi: getContractAbiById('synthetixV3AssetGuard'),
    query: {
      enabled:
        !disabled &&
        !!synthetixV3AssetGuardAddress &&
        !isEqualAddress(synthetixV3AssetGuardAddress, AddressZero) &&
        !!mutableBalanceError,
    },
  })

  return mutableBalance?.toString() ?? balance?.toString() ?? '0'
}
