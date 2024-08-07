import { useCallback, useMemo } from 'react'

import {
  DEFAULT_EASY_SWAPPER_WITHDRAW_METHOD,
  DEFAULT_MULTI_ASSET_WITHDRAW_METHOD,
  DEFAULT_PRECISION,
  DEFAULT_WITHDRAW_SLIPPAGE,
} from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import { useTradingSettleHandler } from 'core-kit/hooks/trading'
import { useContractFunction } from 'core-kit/hooks/web3'
import { DefaultSellingParams } from 'core-kit/models'

import type {
  ContractActionFunc,
  SendEstimationResult,
} from 'core-kit/types/web3.types'
import {
  getOrderedTxArgs,
  getSlippageToleranceForWithdrawSafe,
  logTransactionArguments,
} from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

import { useIsMultiAssetWithdraw } from './use-is-multi-asset-withdraw'
import { useWithdrawSlippage } from './use-withdraw-slippage'
import { useWithdrawTradingParams } from './use-withdraw-trading-params'

const action = 'withdraw'

export const useWithdraw = (): ContractActionFunc => {
  const poolConfig = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const [{ minSlippage, slippage: tradingSlippage }] = useTradingPanelSettings()
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const isMultiAssetsWithdraw = useIsMultiAssetWithdraw()
  const {
    receiveAssetAddress,
    sendAssetAddress,
    receiveAssetAmount,
    fromTokenAmount,
  } = useWithdrawTradingParams()
  const { defaultWithdrawSlippageScale } = useConfigContextParams()

  const onSettled = useTradingSettleHandler(action)

  const functionName = isMultiAssetsWithdraw
    ? DEFAULT_MULTI_ASSET_WITHDRAW_METHOD
    : poolConfig.withdrawParams.customTokens.find(
        ({ address }) => address === receiveToken.address,
      )?.method ?? DEFAULT_EASY_SWAPPER_WITHDRAW_METHOD
  const { send, estimate } = useContractFunction({
    contractId: isMultiAssetsWithdraw ? 'poolLogic' : 'easySwapper',
    dynamicContractAddress: isMultiAssetsWithdraw
      ? poolConfig.address
      : undefined,
    functionName,
    onSettled,
  })

  const txArgs = useMemo(
    () =>
      new DefaultSellingParams({
        sendAssetAddress,
        fromTokenAmount: fromTokenAmount
          .shiftedBy(DEFAULT_PRECISION)
          .toFixed(0),
        receiveAssetAddress,
        receiveAssetInputValue: receiveAssetAmount,
        decimalsReceiveToken: receiveToken.decimals,
      }),
    [
      fromTokenAmount,
      receiveAssetAddress,
      receiveAssetAmount,
      sendAssetAddress,
      receiveToken.decimals,
    ],
  )

  const estimateSell = useCallback(async () => {
    const isAuto = tradingSlippage === 'auto'
    const slippageScale = isAuto
      ? defaultWithdrawSlippageScale
      : Array.from(new Set([tradingSlippage, ...defaultWithdrawSlippageScale]))
    const estimationMap = new Map<number, SendEstimationResult>()

    for (let i = 0; i < slippageScale.length; i++) {
      const slippage = slippageScale[i] ?? 0
      const argsToUse: unknown[] = getOrderedTxArgs(txArgs, slippage)
      const { value: gas, error } = await estimate(...argsToUse)

      if (gas === BigInt(0) || !!error) {
        continue
      }

      estimationMap.set(slippage, {
        gas,
        argsToUse,
      })

      // min slippage estimation is defined
      if (slippage !== tradingSlippage) {
        break
      }
    }

    if (estimationMap.size) {
      console.table(Object.fromEntries(estimationMap), ['gas'])
    } else {
      console.debug(
        '[Toros Finance]: Currently slippage options are not available for range',
        slippageScale,
      )
    }
    return estimationMap
  }, [estimate, tradingSlippage, txArgs, defaultWithdrawSlippageScale])

  useWithdrawSlippage({
    estimateSell,
    fromTokenAmount,
    isMultiAssetsWithdraw,
  })

  return useCallback(async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol: poolConfig.symbol,
      chainId: poolConfig.chainId,
    })

    logTransactionArguments(txArgs)

    if (isMultiAssetsWithdraw) {
      return send(
        txArgs.fromTokenAmount,
        getSlippageToleranceForWithdrawSafe(
          tradingSlippage === 'auto'
            ? DEFAULT_WITHDRAW_SLIPPAGE
            : tradingSlippage,
        ),
      )
    }
    const isAuto = tradingSlippage === 'auto'
    const slippageValue = isAuto
      ? minSlippage ?? DEFAULT_WITHDRAW_SLIPPAGE
      : tradingSlippage
    const args: unknown[] = getOrderedTxArgs(txArgs, slippageValue)

    return send(...args)
  }, [
    isMultiAssetsWithdraw,
    minSlippage,
    poolConfig.symbol,
    poolConfig.chainId,
    send,
    tradingSlippage,
    txArgs,
    updatePendingTransactions,
  ])
}
