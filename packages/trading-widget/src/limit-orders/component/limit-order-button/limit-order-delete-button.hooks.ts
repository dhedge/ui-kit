import BigNumber from 'bignumber.js'

import { AddressZero } from 'core-kit/const'
import { useAccount, useContractFunction } from 'core-kit/hooks/web3'
import { useLimitOrderState } from 'limit-orders/hooks/state'
import { useOnLimitOrderSettled } from 'limit-orders/hooks/use-on-limit-order-settled'
import { useUserLimitOrder } from 'limit-orders/hooks/use-user-limit-order'

export const useLimitOrderDeleteButton = () => {
  const { account = AddressZero } = useAccount()
  const { vaultAddress, vaultChainId, pendingTransaction } =
    useLimitOrderState()
  const { data: limitOrder } = useUserLimitOrder({
    userAddress: account,
    vaultAddress,
    chainId: vaultChainId,
  })

  const onSettled = useOnLimitOrderSettled()
  const { send } = useContractFunction({
    onSettled,
    contractId: 'limitOrder',
    functionName: 'deleteLimitOrder',
  })

  const deleteLimitOrder = async () => send(vaultAddress)
  const isPending = !!pendingTransaction
  const displayButton =
    !!limitOrder?.amountD18 &&
    !new BigNumber(limitOrder.amountD18.toString()).isZero()

  return { deleteLimitOrder, isPending, displayButton }
}
