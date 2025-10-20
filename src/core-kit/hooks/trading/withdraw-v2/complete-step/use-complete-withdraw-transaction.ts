import { useCallback, useMemo } from 'react'

import { EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import {
  useCompleteWithdrawExpectedAmount,
  useCompleteWithdrawSwapData,
  useCompleteWithdrawTrackedAssets,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { buildSwapWithdrawTransactionData } from 'core-kit/utils'

interface UseWithdrawSwapTransactionProps {
  isClaim?: boolean
}

export const useCompleteWithdrawTransaction = ({
  isClaim,
}: UseWithdrawSwapTransactionProps | undefined = {}): ContractActionFunc => {
  const poolConfig = useTradingPanelPoolConfig()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  const { data: swapData } = useCompleteWithdrawSwapData()
  const [receiveToken] = useReceiveTokenInput()
  const { minExpectedReceiveAmount } = useCompleteWithdrawExpectedAmount()

  const updatePendingTransactions = useTradingPanelTransactions()[1]

  const action = isClaim ? 'claim' : 'swap'
  const onSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    contractId: 'easySwapperV2',
    functionName: EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD,
    onSettled,
  })
  const hasSwappableAssets = useHasSwappableAssets()

  const txArgs = useMemo(() => {
    if (isClaim || !hasSwappableAssets) {
      return []
    }

    const transactionSwapData = buildSwapWithdrawTransactionData({
      assets,
      swapData,
      receiveAssetAddress: receiveToken.address,
    })
    return [transactionSwapData, minExpectedReceiveAmount]
  }, [
    hasSwappableAssets,
    isClaim,
    assets,
    swapData,
    receiveToken.address,
    minExpectedReceiveAmount,
  ])

  return useCallback(async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol: poolConfig.symbol,
      chainId: poolConfig.chainId,
    })

    console.log('Arguments', txArgs)

    return send(...txArgs)
  }, [
    action,
    poolConfig.chainId,
    poolConfig.symbol,
    send,
    txArgs,
    updatePendingTransactions,
  ])
}
