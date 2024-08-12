import { useCallback } from 'react'

import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { ContractActionFunc } from 'core-kit/types/web3.types'

import { useVaultDepositParams } from './use-vault-deposit-params'
import { useVaultDepositTransactionArguments } from './use-vault-deposit-transaction-arguments'

const action = 'deposit'

export const useDeposit = (): ContractActionFunc => {
  const { chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const { depositMethod, vaultDepositTokenAddress } = useVaultDepositParams()
  const txArgs = useVaultDepositTransactionArguments({
    depositMethod,
    vaultDepositTokenAddress,
  })

  // TODO: remove
  console.log('depositMethod', depositMethod)
  console.log('vaultDepositTokenAddress', vaultDepositTokenAddress)
  console.log('sendToken.address', sendToken.address)
  console.log('Transaction Arguments:', txArgs)

  const onSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    contractId: 'easySwapperV2',
    functionName: depositMethod,
    onSettled,
  })

  return useCallback(async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol: receiveToken.symbol,
      chainId,
    })

    console.log('Transaction Arguments:', txArgs)
    return send(...txArgs)
  }, [updatePendingTransactions, chainId, receiveToken.symbol, send, txArgs])
}
