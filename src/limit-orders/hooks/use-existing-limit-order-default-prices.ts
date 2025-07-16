import type { Address } from 'viem'

import { AddressZero, MaxUint256 } from 'core-kit/const'
import { useAccount } from 'core-kit/hooks/web3'
import { useUserLimitOrder } from 'limit-orders/hooks/use-user-limit-order'

interface UseExistingLimitOrderDefaultPricesProps {
  vaultAddress: Address
  vaultChainId: number
}

export const useExistingLimitOrderDefaultPrices = ({
  vaultAddress,
  vaultChainId,
}: UseExistingLimitOrderDefaultPricesProps) => {
  const { account: userAddress = AddressZero } = useAccount()
  const { isFetched, data: limitOrder } = useUserLimitOrder({
    vaultAddress,
    chainId: vaultChainId,
    userAddress,
  })
  const upperLimitPrice =
    !!limitOrder && limitOrder.takeProfitPriceD18 !== MaxUint256
      ? limitOrder.takeProfitPrice
      : ''
  const lowerLimitPrice =
    !!limitOrder && limitOrder.stopLossPriceD18 !== BigInt(0)
      ? limitOrder.stopLossPrice
      : ''

  return { isFetched, upperLimitPrice, lowerLimitPrice }
}
