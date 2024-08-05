import { useCallback, useMemo } from 'react'

import { DEFAULT_DEPOSIT_SLIPPAGE } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelDepositMethod,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
  useTradingPanelTransactions,
} from 'core-kit/hooks/state'
import {
  useIsEasySwapperTrading,
  useTradingSettleHandler,
} from 'core-kit/hooks/trading'
import {
  useDepositSlippage,
  useDepositTradingParams,
} from 'core-kit/hooks/trading/deposit'
import { useContractFunction } from 'core-kit/hooks/web3'

import {
  BuyingWithEasyswapperArgs,
  BuyingWithNativeAssetArgs,
  BuyingWithPoolLogicArgs,
} from 'core-kit/models'
import type { ContractActionFunc } from 'core-kit/types/web3.types'
import {
  getOrderedTxArgs,
  isNativeToken,
  logTransactionArguments,
} from 'core-kit/utils'

const action = 'deposit'

export const useDeposit = (): ContractActionFunc => {
  const poolConfig = useTradingPanelPoolConfig()
  const [depositMethod] = useTradingPanelDepositMethod()
  const [sendToken] = useSendTokenInput()
  const [receiveToken] = useReceiveTokenInput()
  const updatePendingTransactions = useTradingPanelTransactions()[1]
  const [{ slippage }] = useTradingPanelSettings()
  const isEasySwapperDeposit = useIsEasySwapperTrading()
  const {
    poolDepositAddress,
    receiveAssetAddress,
    sendAssetAddress,
    receiveAssetAmount,
    fromTokenAmount,
  } = useDepositTradingParams()

  useDepositSlippage(receiveAssetAmount)

  const isDepositNative =
    poolConfig.chainId && isEasySwapperDeposit
      ? isNativeToken(sendToken.symbol, poolConfig.chainId)
      : false
  const functionName = isDepositNative
    ? depositMethod === 'deposit'
      ? 'depositNative'
      : 'depositNativeWithCustomCooldown'
    : depositMethod

  const onSettled = useTradingSettleHandler(action)
  const txArgs = useMemo(() => {
    const depositAddress = poolDepositAddress ?? sendAssetAddress
    const depositArgs = {
      receiveAssetAddress,
      fromTokenAmount: fromTokenAmount.shiftedBy(sendToken.decimals).toFixed(0),
      poolDepositAddress: depositAddress,
      receiveAssetInputValue: receiveAssetAmount,
    }

    if (!isEasySwapperDeposit) {
      return new BuyingWithPoolLogicArgs({
        ...depositArgs,
        fromTokenAddress: sendAssetAddress,
      })
    }

    if (isDepositNative) {
      return new BuyingWithNativeAssetArgs(depositArgs)
    }

    return new BuyingWithEasyswapperArgs({
      ...depositArgs,
      sendAssetAddress,
    })
  }, [
    fromTokenAmount,
    isDepositNative,
    isEasySwapperDeposit,
    poolDepositAddress,
    receiveAssetAddress,
    receiveAssetAmount,
    sendAssetAddress,
    sendToken.decimals,
  ])
  const { send } = useContractFunction({
    contractId: isEasySwapperDeposit ? 'easySwapper' : 'poolLogic',
    dynamicContractAddress: isEasySwapperDeposit
      ? undefined
      : receiveToken.address,
    functionName,
    onSettled,
  })

  return useCallback(async () => {
    updatePendingTransactions({
      type: 'add',
      action,
      symbol: receiveToken.symbol,
      chainId: poolConfig.chainId,
    })

    logTransactionArguments(txArgs)
    const args: unknown[] = getOrderedTxArgs(
      txArgs,
      slippage === 'auto' ? DEFAULT_DEPOSIT_SLIPPAGE : slippage,
    )
    if (isDepositNative) {
      args.push({ value: BigInt(txArgs.fromTokenAmount) })
    }
    return send(...args)
  }, [
    updatePendingTransactions,
    isDepositNative,
    poolConfig.chainId,
    receiveToken.symbol,
    send,
    txArgs,
    slippage,
  ])
}
