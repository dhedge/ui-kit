import BigNumber from 'bignumber.js'

import type { Address } from 'viem'
import { stringToHex } from 'viem'

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
 * @param {string} slippage - The slippage value in % from 0 to 100.
 * @returns {string} - The slippage tolerance.
 */
export const getSlippageToleranceForWithdrawSafe = (
  slippage: number,
): string => {
  const minSlippageStep = new BigNumber(0.01)
  const slippageBN = new BigNumber(slippage)

  const slippageToUse =
    !slippageBN.isZero() && slippageBN.lt(minSlippageStep)
      ? minSlippageStep
      : slippageBN

  return slippageToUse.multipliedBy(100).toFixed(0)
}

export const buildZapDepositTransactionArguments = ({
  vaultAddress,
  swapData,
  sendTokenAddress,
  sendTokenAmount,
  vaultDepositTokenAddress,
  minVaultTokensReceivedAmount,
}: {
  vaultAddress: Address
  swapData: string
  sendTokenAddress: Address
  sendTokenAmount: string
  vaultDepositTokenAddress: Address
  minVaultTokensReceivedAmount: string
}) => {
  const aggregatorData = [stringToHex('ONE_INCH', { size: 32 }), swapData]
  const srcData = [sendTokenAddress, sendTokenAmount, aggregatorData]
  const destData = [vaultDepositTokenAddress, '0']
  return [vaultAddress, [srcData, destData], minVaultTokensReceivedAmount]
}
