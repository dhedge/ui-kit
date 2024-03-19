import BigNumber from 'bignumber.js'

import type { TxArgs } from 'core-kit/types/trading.types'

import { shiftBy } from './number'

export const calcMinReturnAmount = (
  txWithSlippageArgs: TxArgs,
  slippage: number,
): string => {
  const minOutMultiplier = new BigNumber(1).minus(
    new BigNumber(slippage).dividedBy(100),
  )
  const minReturnAmount = new BigNumber(
    txWithSlippageArgs.receiveAssetInputValue,
  ).times(minOutMultiplier)
  if ('decimalsReceiveToken' in txWithSlippageArgs) {
    return shiftBy(minReturnAmount, txWithSlippageArgs.decimalsReceiveToken)
  }

  return shiftBy(minReturnAmount)
}

export const getOrderedTxArgs = (txArgs: TxArgs, slippage: number) => {
  const minReturnAmount = calcMinReturnAmount(txArgs, slippage)
  return txArgs.getOrderedArgs(minReturnAmount)
}

export const logTransactionArguments = (txArgs: TxArgs) =>
  console.table(
    Object.entries(txArgs).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[key] = BigNumber.isBigNumber(value) ? value.toNumber() : value
        return acc
      },
      {},
    ),
  )
