import { useCallback } from 'react'

import { EasySwapperV2Abi } from 'core-kit/abi'
import { useBatchApproveTransaction } from 'core-kit/hooks/trading/deposit-v2/deposit-transaction/use-batch-approve-transaction'
import { useDepositCommon } from 'core-kit/hooks/trading/deposit-v2/deposit-transaction/use-deposit-common'
import { useBatchTradingSettleHandler } from 'core-kit/hooks/trading/trade-handlers/use-batch-trading-settle-handler'
import { useCustomSendCalls } from 'core-kit/hooks/web3/use-custom-send-calls'
import { getContractAddressById } from 'core-kit/utils'

const action = 'deposit'

export const useBatchDeposit = () => {
  const { chainId, depositMethod, txArgs, addPendingTransaction } =
    useDepositCommon()

  const approveTransaction = useBatchApproveTransaction()

  const onSettled = useBatchTradingSettleHandler(action)
  const send = useCustomSendCalls({
    onSettled,
  })

  return useCallback(async () => {
    addPendingTransaction()

    const depositTransaction = {
      address: getContractAddressById('easySwapperV2', chainId),
      abi: EasySwapperV2Abi,
      functionName: depositMethod,
      args: txArgs,
    }

    console.log('Approve:', approveTransaction)
    console.log('Deposit:', depositTransaction)

    return send([approveTransaction, depositTransaction])
  }, [
    addPendingTransaction,
    chainId,
    depositMethod,
    txArgs,
    send,
    approveTransaction,
  ])
}
