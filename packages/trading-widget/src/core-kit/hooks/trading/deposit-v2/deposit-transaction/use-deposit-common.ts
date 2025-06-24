import { useCallback } from 'react'

import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'

import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { useVaultDepositTransactionArguments } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-transaction-arguments'

export const useDepositCommon = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const updatePendingTransactions = useTradingPanelTransactions()[1]

  const { depositMethod, vaultDepositTokenAddress } = useVaultDepositParams()
  const txArgs = useVaultDepositTransactionArguments({
    depositMethod,
    vaultDepositTokenAddress,
  })

  const addPendingTransaction = useCallback(() => {
    updatePendingTransactions({
      type: 'add',
      action: 'deposit',
      symbol: receiveToken.symbol,
      chainId,
    })
  }, [updatePendingTransactions, receiveToken.symbol, chainId])

  return {
    chainId,
    depositMethod,
    txArgs,
    addPendingTransaction,
  }
}
