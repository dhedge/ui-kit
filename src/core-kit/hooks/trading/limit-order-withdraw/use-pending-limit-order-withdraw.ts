import { useMemo } from 'react'

import { AddressZero, DEFAULT_PRECISION, MaxUint256 } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useAccount } from 'core-kit/hooks/web3'
import { formatUnits } from 'core-kit/utils'
import { useUserLimitOrder } from 'limit-orders/hooks/use-user-limit-order'

export const usePendingLimitOrderWithdraw = () => {
  const { account = AddressZero } = useAccount()
  const { address: vaultAddress, chainId } = useTradingPanelPoolConfig()
  const { data: limitOrder } = useUserLimitOrder({
    userAddress: account,
    vaultAddress,
    chainId,
  })

  return useMemo(() => {
    const hasPendingLimitOrderWithdraw =
      !!limitOrder &&
      limitOrder.stopLossPriceD18 === BigInt(0) &&
      limitOrder.takeProfitPriceD18 === MaxUint256

    const pendingLimitOrderWithdrawAmount = hasPendingLimitOrderWithdraw
      ? formatUnits(limitOrder.amountD18, DEFAULT_PRECISION)
      : '0'

    return {
      hasPendingLimitOrderWithdraw,
      pendingLimitOrderWithdrawAmount,
    }
  }, [limitOrder])
}
