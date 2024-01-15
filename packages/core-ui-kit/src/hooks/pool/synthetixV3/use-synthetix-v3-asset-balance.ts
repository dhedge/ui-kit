import { PoolFactoryAbi } from 'abi'
import { AddressZero, DHEDGE_SYNTHETIX_V3_ASSETS_MAP, optimism } from 'const'
import { useContractRead, useStaticCall } from 'hooks/web3'
import type { Address, ChainId } from 'types'

import { getContractAddressById, isEqualAddress } from 'utils'

interface UseSynthetixV3AssetBalanceVariables {
  vaultAddress: Address
  chainId?: ChainId
  disabled?: boolean
}

export const useSynthetixV3AssetBalance = ({
  vaultAddress,
  disabled,
  chainId,
}: UseSynthetixV3AssetBalanceVariables) => {
  const synthetixV3AssetAddress = chainId
    ? DHEDGE_SYNTHETIX_V3_ASSETS_MAP[chainId] ?? AddressZero
    : AddressZero
  const { data: synthetixV3AssetGuardAddress } = useContractRead({
    address: getContractAddressById('factory', chainId ?? optimism.id),
    chainId,
    abi: PoolFactoryAbi,
    functionName: 'getAssetGuard',
    args: [synthetixV3AssetAddress],
    staleTime: Infinity,
    enabled: !disabled,
  })

  return (
    useStaticCall<bigint>({
      contractId: 'synthetixV3AssetGuard',
      dynamicContractAddress: synthetixV3AssetGuardAddress ?? AddressZero,
      chainId,
      disabled:
        disabled ||
        !synthetixV3AssetGuardAddress ||
        isEqualAddress(synthetixV3AssetGuardAddress, AddressZero),
      functionName: 'getBalanceMutable',
      args: [vaultAddress, synthetixV3AssetAddress],
    })?.toString() ?? '0'
  )
}
