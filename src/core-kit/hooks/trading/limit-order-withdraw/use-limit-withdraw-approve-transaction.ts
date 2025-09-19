import { useState } from 'react'

import { MaxUint256 } from 'core-kit/const'
import {
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useContractFunction } from 'core-kit/hooks/web3'
import { getContractAddressById } from 'core-kit/utils'

const action = 'approve'

export const useLimitWithdrawApproveTransaction = () => {
  const { address: vaultAddress, chainId, symbol } = useTradingPanelPoolConfig()
  const [isLoading, setIsLoading] = useState(false)
  const limitOrderAddress = getContractAddressById('limitOrder', chainId)
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onApproveSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    contractId: 'erc20',
    dynamicContractAddress: vaultAddress,
    functionName: 'approve',
    onSettled(...args) {
      setIsLoading(false)
      onApproveSettled(...args)
    },
  })

  const approveLimitOrder = async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol,
      chainId,
    })

    setIsLoading(true)
    send(limitOrderAddress, MaxUint256)
  }

  return {
    approveLimitOrder,
    isApprovePending: isLoading,
  }
}
