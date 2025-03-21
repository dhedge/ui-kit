import { useState } from 'react'

import { AddressZero } from 'core-kit/const'
import {
  useAccount,
  useBalance,
  useContractFunction,
} from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'

export const useLimitOrderApproveTransaction = () => {
  const { account = AddressZero } = useAccount()
  const { vaultAddress, vaultChainId, pendingTransaction } =
    useLimitOrderState()
  const { setPendingTransaction } = useLimitOrderActions()
  const [isLoading, setIsLoading] = useState(false)
  const limitOrderAddress = getContractAddressById('limitOrder', vaultChainId)

  const { data: vaultBalance } = useBalance({
    address: account,
    token: vaultAddress,
    chainId: vaultChainId,
  })

  const { send } = useContractFunction({
    contractId: 'erc20',
    dynamicContractAddress: vaultAddress,
    functionName: 'approve',
    onSettled(transaction) {
      setPendingTransaction(transaction ?? null)
      setIsLoading(false)
    },
  })

  const approveLimitOrder = async () => {
    setIsLoading(true)
    send(limitOrderAddress, vaultBalance?.value)
  }

  return {
    approveLimitOrder,
    isApprovePending: isLoading || !!pendingTransaction,
  }
}
