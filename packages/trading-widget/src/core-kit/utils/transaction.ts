import BigNumber from 'bignumber.js'

import type { Address } from 'viem'
import { stringToHex } from 'viem'

import type { useCompleteWithdrawSwapData } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-swap-data'
import type { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-tracked-assets'

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
  routerKey = 'ONE_INCH',
  swapDestinationAmount,
  swapSlippage,
}: {
  vaultAddress: Address
  swapData: string
  sendTokenAddress: Address
  sendTokenAmount: string
  vaultDepositTokenAddress: Address
  minVaultTokensReceivedAmount: string
  routerKey: string | undefined
  swapDestinationAmount: string
  swapSlippage: number
}) => {
  const minDestinationAmount = new BigNumber(swapDestinationAmount)
    .multipliedBy(1 - swapSlippage / 100)
    .toFixed(0)
  const aggregatorData = [stringToHex(routerKey, { size: 32 }), swapData]
  const srcData = [sendTokenAddress, sendTokenAmount, aggregatorData]
  const destData = [vaultDepositTokenAddress, minDestinationAmount]
  return [vaultAddress, [srcData, destData], minVaultTokensReceivedAmount]
}

export const buildSwapWithdrawTransactionData = ({
  receiveAssetAddress,
  slippage,
  assets,
  swapData,
}: {
  receiveAssetAddress: Address
  slippage: number
  assets: ReturnType<typeof useCompleteWithdrawTrackedAssets>['data']
  swapData: ReturnType<typeof useCompleteWithdrawSwapData>['data']
}) => {
  const defaultSwapData = {
    srcData: [] as unknown[],
    destAmount: new BigNumber('0'),
  }
  const { srcData, destAmount } =
    assets?.reduce((acc, asset) => {
      const assetSwapData = swapData?.[asset.address]

      if (!assetSwapData) {
        return acc
      }

      const aggregatorData = [
        stringToHex(assetSwapData.routerKey, { size: 32 }),
        assetSwapData.txData,
      ]
      const srcData = [asset.address, asset.rawBalance, aggregatorData]

      return {
        srcData: [...acc.srcData, srcData],
        destAmount: acc.destAmount.plus(assetSwapData.destinationAmount),
      }
    }, defaultSwapData) ?? defaultSwapData

  return [
    srcData,
    [
      receiveAssetAddress,
      destAmount.times(1 - slippage / 100).toFixed(0, BigNumber.ROUND_DOWN),
    ],
  ]
}
