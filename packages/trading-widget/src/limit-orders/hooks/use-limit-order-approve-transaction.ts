import { useCallback, useState } from 'react'

import { AddressZero } from 'core-kit/const'
import {
  useAccount,
  useBalance,
  useContractFunction,
} from 'core-kit/hooks/web3'
import { getContractAddressById, getErrorMessage } from 'core-kit/utils'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'

export type LimitOrderApproveError = string | null

export const useLimitOrderApproveTransaction = () => {
  const { account = AddressZero } = useAccount()
  const { vaultAddress, vaultChainId, pendingTransaction } =
    useLimitOrderState()
  const { setPendingTransaction } = useLimitOrderActions()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<LimitOrderApproveError>(null)
  const limitOrderAddress = getContractAddressById('limitOrder', vaultChainId)

  const { data: vaultBalance } = useBalance({
    address: account,
    token: vaultAddress,
    chainId: vaultChainId,
  })

  const { send, estimate } = useContractFunction({
    contractId: 'erc20',
    dynamicContractAddress: vaultAddress,
    functionName: 'approve',
    onSettled(transaction, error) {
      setPendingTransaction(transaction ?? null)
      setIsLoading(false)
      if (error) {
        setError(getErrorMessage(error))
      } else {
        setError(null)
      }
    },
  })

  const validateApproval = useCallback(async () => {
    if (!vaultBalance?.value) {
      throw new Error('No balance available for approval')
    }

    if (!limitOrderAddress) {
      throw new Error('Limit order contract address not found')
    }

    try {
      await estimate(limitOrderAddress, vaultBalance.value)
    } catch (error) {
      throw new Error('Transaction would fail: ' + (error as Error).message)
    }
  }, [vaultBalance?.value, limitOrderAddress, estimate])

  const approveLimitOrder = async () => {
    try {
      setError(null)
      setIsLoading(true)
      await validateApproval()
      await send(limitOrderAddress, vaultBalance?.value)
    } catch (err) {
      setError(getErrorMessage(error))
      setIsLoading(false)
    }
  }

  return {
    approveLimitOrder,
    isApprovePending: isLoading || !!pendingTransaction,
    error,
    resetError: () => setError(null),
  }
}
