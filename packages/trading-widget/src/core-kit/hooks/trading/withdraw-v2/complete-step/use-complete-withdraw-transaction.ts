import { useCallback, useMemo } from 'react'

import { EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import {
  useCompleteWithdrawExpectedAmount,
  useCompleteWithdrawSwapData,
  useCompleteWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { ContractActionFunc } from 'core-kit/types/web3.types'
import {
  buildSwapWithdrawTransactionData,
  isEqualAddress,
} from 'core-kit/utils'

const functionName = EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD

interface UseWithdrawSwapTransactionProps {
  skipSwap?: boolean
}

export const useCompleteWithdrawTransaction = ({
  skipSwap,
}: UseWithdrawSwapTransactionProps | undefined = {}): ContractActionFunc => {
  const poolConfig = useTradingPanelPoolConfig()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  const { data: swapData } = useCompleteWithdrawSwapData()
  const [receiveToken] = useReceiveTokenInput()
  const { minExpectedReceiveAmount } = useCompleteWithdrawExpectedAmount()
  const slippage = useAppliedWithdrawSlippage()

  const updatePendingTransactions = useTradingPanelTransactions()[1]

  const action = skipSwap ? 'claim' : 'swap'
  const onSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    contractId: 'easySwapperV2',
    functionName,
    onSettled,
  })

  const txArgs = useMemo(() => {
    const hasNoAssetsToBeSwapped = assets.every(({ address }) =>
      isEqualAddress(address, receiveToken.address),
    )
    if (skipSwap || hasNoAssetsToBeSwapped) {
      return []
    }

    const transactionSwapData = buildSwapWithdrawTransactionData({
      assets,
      swapData,
      slippage,
      receiveAssetAddress: receiveToken.address,
    })
    return [transactionSwapData, minExpectedReceiveAmount]
  }, [
    skipSwap,
    assets,
    swapData,
    slippage,
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

    console.log('Function', functionName)
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
