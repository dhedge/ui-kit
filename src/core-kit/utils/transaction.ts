import BigNumber from 'bignumber.js'

import type { Address, Hex } from 'viem'
import { encodeAbiParameters, stringToHex } from 'viem'

import {
  ComplexWithdrawalAssetSrcDataAbiItem,
  ComplexWithdrawalDataAbiItem,
} from 'core-kit/abi'
import type {
  fetchSwapsDataForAave,
  useSwapsDataQuery,
} from 'core-kit/hooks/trading/use-swaps-data-query'
import type { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-tracked-assets'
import type { CalculateSwapDataParamsResponse } from 'core-kit/types'
import { buildSwapDataKeyForAave } from 'core-kit/utils/aave'

/**
 * Calculates the slippage tolerance for withdrawSafe.
 * Returns an integer number from 0 to 10000,
 * where 10_000 = 100%, 100 = 1%, 10 = 0.1%, 1 = 0.01% etc.
 * @param {string} slippage - The slippage value in % from 0 to 100.
 * @returns {string} - The slippage tolerance.
 */
export const getSlippageToleranceForContractTransaction = (
  slippage: number,
): bigint => {
  const minSlippageStep = new BigNumber(0.01)
  const slippageBN = new BigNumber(slippage)

  const slippageToUse =
    !slippageBN.isZero() && slippageBN.lt(minSlippageStep)
      ? minSlippageStep
      : slippageBN

  return BigInt(slippageToUse.multipliedBy(100).toFixed(0))
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
  swapData: Hex
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
  assets,
  swapData,
}: {
  receiveAssetAddress: Address
  assets: ReturnType<typeof useCompleteWithdrawTrackedAssets>['data']
  swapData: ReturnType<typeof useSwapsDataQuery>['data']
}) => {
  const defaultSwapData = {
    srcData: [] as unknown[],
    destAmount: new BigNumber('0'),
  }
  const { srcData } =
    assets?.reduce((acc, asset) => {
      const assetSwapData = swapData?.[asset.address]

      if (!assetSwapData) {
        return acc
      }

      const aggregatorData = [
        stringToHex(assetSwapData.routerKey, { size: 32 }),
        assetSwapData.rawTransaction.data,
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
      // destAmount.times(1 - slippage / 100).toFixed(0, BigNumber.ROUND_DOWN),
      // Use 0 to allow swaps with incorrectly increased destination amounts. Slippage protection is handled at a higher level using minExpectedReceiveAmount.
      '0',
    ],
  ]
}

export const buildAaveWithdrawAssetTransactionData = ({
  assetAddress,
  swapData,
  swapParams,
  slippageToleranceForContractTransaction,
}: {
  assetAddress: Address
  swapParams: CalculateSwapDataParamsResponse | undefined
  swapData: Awaited<ReturnType<typeof fetchSwapsDataForAave>>
  slippageToleranceForContractTransaction: bigint
}) => {
  if (!swapParams) {
    return {
      supportedAsset: assetAddress,
      withdrawData: '',
      slippageTolerance: BigInt(0),
    }
  }

  const { srcData, dstData } = swapParams
  const srcDataToEncode = srcData.map(({ asset, amount }) => {
    const assetSwapData =
      swapData?.[
        buildSwapDataKeyForAave({
          sourceAddress: asset,
          amount: amount.toString(),
        })
      ]
    return {
      asset,
      amount,
      swapData: {
        routerKey: stringToHex(assetSwapData?.routerKey ?? '', { size: 32 }),
        txData: assetSwapData?.rawTransaction.data ?? '0x',
      },
    }
  })

  const encodedSrcData = encodeAbiParameters(
    ComplexWithdrawalAssetSrcDataAbiItem,
    [srcDataToEncode],
  )

  const withdrawData = encodeAbiParameters(ComplexWithdrawalDataAbiItem, [
    {
      encodedSrcData,
      dstData: {
        dstAddress: dstData.asset,
        dstAmount: dstData.amount,
      },
      slippage: slippageToleranceForContractTransaction,
    },
  ])

  return {
    supportedAsset: assetAddress,
    withdrawData: withdrawData,
    slippageTolerance: slippageToleranceForContractTransaction,
  }
}
