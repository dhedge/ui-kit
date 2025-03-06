import { useReadContract } from 'wagmi'

import { LimitOrderAbi } from 'core-kit/abi'
import type { Address } from 'core-kit/types'
import { getContractAddressById, isZeroAddress } from 'core-kit/utils'
import { getLimitOrderId } from 'limit-orders/utils'

interface UseUserLimitOrderParams {
  vaultAddress: Address
  userAddress: Address
  chainId: number
}

export const useUserLimitOrder = ({
  chainId,
  userAddress,
  vaultAddress,
}: UseUserLimitOrderParams) =>
  useReadContract({
    address: getContractAddressById('limitOrder', chainId),
    abi: LimitOrderAbi,
    chainId,
    functionName: 'limitOrders',
    args: [getLimitOrderId({ userAddress, vaultAddress })],
    query: {
      enabled: !isZeroAddress(userAddress) && !isZeroAddress(vaultAddress),
    },
  })
