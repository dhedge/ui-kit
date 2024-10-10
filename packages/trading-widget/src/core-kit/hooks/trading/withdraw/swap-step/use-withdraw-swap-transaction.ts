import { useCallback, useMemo } from 'react'

import { EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading/index'
import { useWithdrawSlippage } from 'core-kit/hooks/trading/withdraw'
import {
  useExpectedReceiveSwapAmount,
  useWithdrawSwapData,
  useWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw/swap-step'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { ContractActionFunc } from 'core-kit/types/web3.types'
import {
  buildSwapWithdrawTransactionData,
  isEqualAddress,
} from 'core-kit/utils'

const action = 'swap'
const functionName = EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD

export const useWithdrawSwapTransaction = (): ContractActionFunc => {
  const poolConfig = useTradingPanelPoolConfig()
  const { data: assets = [] } = useWithdrawTrackedAssets()
  const { data: swapData } = useWithdrawSwapData()
  const [receiveToken] = useReceiveTokenInput()
  const { minExpectedReceiveAmount } = useExpectedReceiveSwapAmount()
  const slippage = useWithdrawSlippage()

  const updatePendingTransactions = useTradingPanelTransactions()[1]

  const onSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    contractId: 'easySwapperV2',
    functionName,
    onSettled,
  })

  const txArgs = useMemo(() => {
    // check if requires swaps
    if (
      assets.every(({ address }) =>
        isEqualAddress(address, receiveToken.address),
      )
    ) {
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
    assets,
    receiveToken.address,
    swapData,
    minExpectedReceiveAmount,
    slippage,
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
    poolConfig.chainId,
    poolConfig.symbol,
    send,
    txArgs,
    updatePendingTransactions,
  ])
}