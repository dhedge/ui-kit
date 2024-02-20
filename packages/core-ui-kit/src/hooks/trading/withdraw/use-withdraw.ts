import { useCallback, useMemo } from 'react'

import {
  DEFAULT_PRECISION,
  DEFAULT_WITHDRAW_METHOD,
  DEFAULT_WITHDRAW_SLIPPAGE,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
} from 'const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelTransactions,
} from 'hooks/state'
import { useTradingParams, useTradingSettleHandler } from 'hooks/trading'
import { useContractFunction } from 'hooks/web3'
import { DefaultSellingParams } from 'models'

import type { ContractActionFunc, SendEstimationResult } from 'types/web3.types'
import { getOrderedTxArgs, logTransactionArguments } from 'utils'

import { useIsMultiAssetWithdraw } from './use-is-multi-asset-withdraw'
import { useWithdrawSlippage } from './use-withdraw-slippage'

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
    receiveAssetInputValue,
    fromTokenAmount,
  } = useTradingParams()

  const onSettled = useTradingSettleHandler(action)

  const { method: functionName = DEFAULT_WITHDRAW_METHOD } =
    poolConfig.withdrawParams.customTokens.find(
      ({ address }) => address === receiveToken.address,
    ) ?? { method: DEFAULT_WITHDRAW_METHOD }
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
        receiveAssetInputValue,
        decimalsReceiveToken: receiveToken.decimals,
      }),
    [
      fromTokenAmount,
      receiveAssetAddress,
      receiveAssetInputValue,
      sendAssetAddress,
      receiveToken.decimals,
    ],
  )

  const estimateSell = useCallback(async () => {
    const isAuto = tradingSlippage === 'auto'
    const slippageScale = isAuto
      ? DEFAULT_WITHDRAW_SLIPPAGE_SCALE
      : Array.from(
          new Set([tradingSlippage, ...DEFAULT_WITHDRAW_SLIPPAGE_SCALE]),
        )
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
  }, [estimate, tradingSlippage, txArgs])

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
      return send(txArgs.fromTokenAmount)
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
