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

/**
 * Calculates the slippage tolerance for withdrawSafe.
 * Returns an integer number from 0 to 10000,
 * where 10_000 = 100%, 100 = 1%, 10 = 0.1%, 1 = 0.01% etc.
 * @param {number} slippage - The slippage value in % from 0 to 100.
 * @returns {number} - The slippage tolerance.
 */
export const getSlippageToleranceForWithdrawSafe = (
  slippage: number,
): number => {
  const minSlippageStep = 0.01
  const roundedSlippage = +slippage.toFixed(2)

  const slippageToUse =
    slippage !== 0 && roundedSlippage < minSlippageStep
      ? minSlippageStep
      : roundedSlippage

  return slippageToUse * 100
}
