import { useCallback } from 'react'

import {
  DEFAULT_MULTI_ASSET_WITHDRAW_METHOD,
  EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
  EASY_SWAPPER_V2_UNROLL_AND_CLAIM_METHOD,
} from 'core-kit/const'
import {
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useGetInitWithdrawTransactionArguments } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-get-init-withdraw-transaction-arguments'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-multi-asset-withdraw'
import { useIsUnrollAndClaimTransaction } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-is-unroll-and-claim-transaction'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { TransactionAction } from 'core-kit/types'
import type { ContractActionFunc } from 'core-kit/types/web3.types'

export const useInitWithdrawTransaction = (): {
  withdraw: ContractActionFunc
  action: TransactionAction
} => {
  const poolConfig = useTradingPanelPoolConfig()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const isUnrollAndClaimTransaction = useIsUnrollAndClaimTransaction()
  const getInitWithdrawTransactionArguments =
    useGetInitWithdrawTransactionArguments()

  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const action = isMultiAssetsWithdraw
    ? 'multi_withdraw'
    : isUnrollAndClaimTransaction
      ? 'single_withdraw_and_claim'
      : 'single_withdraw'

  const onSettled = useTradingSettleHandler(action)

  const functionName = isMultiAssetsWithdraw
    ? DEFAULT_MULTI_ASSET_WITHDRAW_METHOD
    : isUnrollAndClaimTransaction
      ? EASY_SWAPPER_V2_UNROLL_AND_CLAIM_METHOD
      : EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD
  const { send } = useContractFunction({
    contractId: isMultiAssetsWithdraw ? 'poolLogic' : 'easySwapperV2',
    dynamicContractAddress: isMultiAssetsWithdraw
      ? poolConfig.address
      : undefined,
    functionName,
    onSettled,
  })

  const withdraw = useCallback(async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol: poolConfig.symbol,
      chainId: poolConfig.chainId,
    })

    const txArgs = await getInitWithdrawTransactionArguments()

    console.log('Arguments', txArgs)

    return send(...txArgs)
  }, [
    updatePendingTransactions,
    action,
    poolConfig.symbol,
    poolConfig.chainId,
    getInitWithdrawTransactionArguments,
    send,
  ])

  return {
    withdraw,
    action,
  }
}
