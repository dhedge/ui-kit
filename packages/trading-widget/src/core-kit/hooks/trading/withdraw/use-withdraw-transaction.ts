import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'

import {
  DEFAULT_MULTI_ASSET_WITHDRAW_METHOD,
  DEFAULT_PRECISION,
  DEFAULT_WITHDRAW_SLIPPAGE,
  EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD,
} from 'core-kit/const'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading/index'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw/use-is-multi-asset-withdraw'
import { useContractFunction } from 'core-kit/hooks/web3'

import type { ContractActionFunc } from 'core-kit/types/web3.types'
import { getSlippageToleranceForWithdrawSafe } from 'core-kit/utils'

const action = 'withdraw'

export const useWithdrawTransaction = (): ContractActionFunc => {
  const poolConfig = useTradingPanelPoolConfig()
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const [sendToken] = useSendTokenInput()

  const [{ slippage: tradingSlippage }] = useTradingPanelSettings()
  const updatePendingTransactions = useTradingPanelTransactions()[1]

  const onSettled = useTradingSettleHandler(action)

  const functionName = isMultiAssetsWithdraw
    ? DEFAULT_MULTI_ASSET_WITHDRAW_METHOD
    : EASY_SWAPPER_V2_INITIATE_WITHDRAW_METHOD
  const { send } = useContractFunction({
    contractId: isMultiAssetsWithdraw ? 'poolLogic' : 'easySwapperV2',
    dynamicContractAddress: isMultiAssetsWithdraw
      ? poolConfig.address
      : undefined,
    functionName,
    onSettled,
  })

  const txArgs = useMemo(() => {
    const withdrawAmount = new BigNumber(sendToken.value || '0')
      .shiftedBy(DEFAULT_PRECISION)
      .toFixed(0, BigNumber.ROUND_DOWN)
    const slippageTolerance = getSlippageToleranceForWithdrawSafe(
      tradingSlippage === 'auto' ? DEFAULT_WITHDRAW_SLIPPAGE : tradingSlippage,
    )

    if (isMultiAssetsWithdraw) {
      return [withdrawAmount, slippageTolerance]
    }

    return [poolConfig.address, withdrawAmount, slippageTolerance]
  }, [
    isMultiAssetsWithdraw,
    sendToken.value,
    tradingSlippage,
    poolConfig.address,
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
    updatePendingTransactions,
    send,
    txArgs,
    functionName,
    poolConfig.symbol,
    poolConfig.chainId,
  ])
}
