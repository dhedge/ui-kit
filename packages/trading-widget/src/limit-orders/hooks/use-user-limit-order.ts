import type { UseReadContractReturnType } from 'wagmi'
import { useReadContract } from 'wagmi'

import { LimitOrderAbi } from 'core-kit/abi'
import { DEFAULT_PRECISION } from 'core-kit/const'
import type { Address } from 'core-kit/types'
import {
  formatUnits,
  getContractAddressById,
  isZeroAddress,
} from 'core-kit/utils'
import { LIMIT_ORDER_READ_FUNCTION_NAME } from 'limit-orders/constants'
import { getLimitOrderId } from 'limit-orders/utils'

interface UseUserLimitOrderParams {
  vaultAddress: Address
  userAddress: Address
  chainId: number
}
type Data = NonNullable<
  UseReadContractReturnType<typeof LimitOrderAbi, 'limitOrders'>['data']
>

const selector = ([
  amountD18,
  stopLossPrice,
  takeProfitPrice,
  user,
  vault,
  pricingAsset,
]: Data) => {
  if (isZeroAddress(vault)) {
    return null
  }

  return {
    takeProfitPrice: formatUnits(takeProfitPrice, DEFAULT_PRECISION),
    stopLossPrice: formatUnits(stopLossPrice, DEFAULT_PRECISION),
    takeProfitPriceD18: takeProfitPrice,
    stopLossPriceD18: stopLossPrice,
    amountD18,
    user,
    vault,
    pricingAsset,
  }
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
    functionName: LIMIT_ORDER_READ_FUNCTION_NAME,
    args: [getLimitOrderId({ userAddress, vaultAddress })],
    query: {
      enabled: !isZeroAddress(userAddress) && !isZeroAddress(vaultAddress),
      select: selector,
    },
  })
