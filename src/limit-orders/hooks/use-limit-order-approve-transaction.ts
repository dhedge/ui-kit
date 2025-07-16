import { useState } from 'react'

import { MaxUint256 } from 'core-kit/const'
import { useContractFunction } from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'

export const useLimitOrderApproveTransaction = () => {
  const { vaultAddress, vaultChainId, pendingTransaction } =
    useLimitOrderState()
  const { setPendingTransaction } = useLimitOrderActions()
  const [isLoading, setIsLoading] = useState(false)
  const limitOrderAddress = getContractAddressById('limitOrder', vaultChainId)

  const { send } = useContractFunction({
    contractId: 'erc20',
    dynamicContractAddress: vaultAddress,
    functionName: 'approve',
    onSettled(hash) {
      setPendingTransaction(hash ? { hash, action: 'approve' } : null)
      setIsLoading(false)
    },
  })

  const approveLimitOrder = async () => {
    setIsLoading(true)
    send(limitOrderAddress, MaxUint256)
  }

  return {
    approveLimitOrder,
    isApprovePending: isLoading || !!pendingTransaction,
  }
}
