import { useCallback } from 'react'

import {
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useContractFunction } from 'core-kit/hooks/web3'

const action = 'delete_limit_order_withdraw'

export const useLimitOrderWithdrawDeleteTransaction = () => {
  const { address: vaultAddress, symbol, chainId } = useTradingPanelPoolConfig()
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const onSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    onSettled,
    contractId: 'limitOrder',
    functionName: 'deleteLimitOrder',
  })

  return useCallback(async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol,
      chainId,
    })

    return send(vaultAddress)
  }, [chainId, send, symbol, updatePendingTransactions, vaultAddress])
}
