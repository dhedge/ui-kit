import { useCallback } from 'react'

import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useDepositCommon } from 'core-kit/hooks/trading/deposit-v2/deposit-transaction/use-deposit-common'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { ContractActionFunc } from 'core-kit/types/web3.types'

const action = 'deposit'

export const useDeposit = (): ContractActionFunc => {
  const { depositMethod, txArgs, addPendingTransaction } = useDepositCommon()

  const onSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    contractId: 'easySwapperV2',
    functionName: depositMethod,
    onSettled,
  })

  return useCallback(async () => {
    addPendingTransaction()

    return send(...txArgs)
  }, [addPendingTransaction, send, txArgs])
}
