import { useCallback, useMemo } from 'react'

import { EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading/index'
import { useExpectedReceiveTokenAmount } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-expected-receive-token-amount'
import { useSwapData } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-swap-data'
import { useTrackedAssets } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-tracked-assets'
import { useWithdrawSlippage } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-slippage'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { buildSwapWithdrawTransactionData } from 'core-kit/utils'

const action = 'withdraw'
const functionName = EASY_SWAPPER_V2_COMPLETE_WITHDRAW_METHOD

export const useSwapTransaction = (): ContractActionFunc => {
  const poolConfig = useTradingPanelPoolConfig()
  const { data: assets = [] } = useTrackedAssets()
  const { data: swapData } = useSwapData()
  const [receiveToken] = useReceiveTokenInput()
  const { minExpectedReceiveAmount } = useExpectedReceiveTokenAmount()
  const slippage = useWithdrawSlippage()

  const updatePendingTransactions = useTradingPanelTransactions()[1]

  const onSettled = useTradingSettleHandler(action)

  const { send } = useContractFunction({
    contractId: 'easySwapperV2',
    functionName,
    onSettled,
  })

  const txArgs = useMemo(() => {
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
    receiveToken.decimals,
    receiveToken.value,
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
