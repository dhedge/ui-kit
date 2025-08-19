import BigNumber from 'bignumber.js'
import type { Address } from 'viem'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolComposition, usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import type { PoolComposition } from 'core-kit/types'
import type { IsLendAndBorrowAssetParams } from 'core-kit/utils'
import {
  formatToUsd,
  getFlatMoneyCollateralByLeverageAddress,
  getGmxWithdrawAssetByLeverageAddress,
  getGmxWithdrawAssetByVaultAddress,
  isAaveLendAndBorrowAsset,
  isEqualAddress,
  isFlatMoneyLeveragedAsset,
  isGmxLeveragedAsset,
} from 'core-kit/utils'

type CollateralInfo = {
  address: Address
  symbol?: string
  decimals?: number
}

type LeveragedAssetConfig = {
  isLeveragedAsset: (address: Address) => boolean
  getWithdrawAssetByLeverageAddress: (address: Address) => CollateralInfo
  getWithdrawAssetByVaultAddress: (
    address: Address,
  ) => CollateralInfo | undefined
  isLentAndBorrowedAsset: (params: IsLendAndBorrowAssetParams) => boolean
}

const LEVERAGED_ASSET_CONFIGS: LeveragedAssetConfig[] = [
  {
    isLeveragedAsset: isFlatMoneyLeveragedAsset,
    getWithdrawAssetByLeverageAddress: getFlatMoneyCollateralByLeverageAddress,
    getWithdrawAssetByVaultAddress: () => undefined,
    isLentAndBorrowedAsset: isAaveLendAndBorrowAsset,
  },
  {
    isLeveragedAsset: isGmxLeveragedAsset,
    getWithdrawAssetByLeverageAddress: getGmxWithdrawAssetByLeverageAddress,
    getWithdrawAssetByVaultAddress: getGmxWithdrawAssetByVaultAddress,
    isLentAndBorrowedAsset: isAaveLendAndBorrowAsset,
  },
]

const DEFAULT_RESULT = {
  requiresLeveragedCollateralLiquidity: false,
  leveragedCollateralValueFormatted: '$0',
}

const calculateAssetValue = (asset: PoolComposition) =>
  BigNumber(asset.amount)
    .shiftedBy(-asset.precision)
    .times(asset.rate)
    .shiftedBy(-DEFAULT_PRECISION)
    .toNumber()

export const useLeveragedWithdrawalChecks = () => {
  const config = useTradingPanelPoolConfig()
  const composition = usePoolComposition(config)
  const [sendToken] = useSendTokenInput()
  const vaultTokenPrice = usePoolTokenPrice(config)

  const leveragedPosition = composition.find(({ tokenAddress, amount }) =>
    LEVERAGED_ASSET_CONFIGS.some(
      (config) =>
        config.isLeveragedAsset(tokenAddress as Address) && amount !== '0',
    ),
  )

  if (!leveragedPosition) {
    return DEFAULT_RESULT
  }

  const assetConfig = LEVERAGED_ASSET_CONFIGS.find((config) =>
    config.isLeveragedAsset(leveragedPosition.tokenAddress),
  )

  if (!assetConfig) {
    return DEFAULT_RESULT
  }

  const withdrawAssetAddress =
    assetConfig.getWithdrawAssetByVaultAddress(config.address)?.address ??
    assetConfig.getWithdrawAssetByLeverageAddress(
      leveragedPosition.tokenAddress as Address,
    ).address

  const withdrawAsset = composition.find(({ tokenAddress }) =>
    isEqualAddress(withdrawAssetAddress, tokenAddress),
  )

  if (!withdrawAsset) {
    return DEFAULT_RESULT
  }

  const sendTokenValue =
    Number(sendToken.value || '0') * Number(vaultTokenPrice)
  const withdrawAssetValue = calculateAssetValue(withdrawAsset)

  const lentAndBorrowedAsset = composition.find(({ tokenAddress, amount }) =>
    LEVERAGED_ASSET_CONFIGS.some(
      (leveragedAssetConfig) =>
        leveragedAssetConfig.isLentAndBorrowedAsset({
          address: tokenAddress as Address,
          chainId: config.chainId,
        }) && amount !== '0',
    ),
  )
  if (lentAndBorrowedAsset) {
    const leveragedPositionValue = calculateAssetValue(leveragedPosition)
    const fullVaultValue = composition.reduce(
      (acc, asset) => acc + calculateAssetValue(asset),
      0,
    )

    // % available withdraw liquidity = % withdrawAsset / (% withdrawAsset + % leverage position)
    const withdrawAssetPercent = withdrawAssetValue / fullVaultValue
    const leveragedPercent = leveragedPositionValue / fullVaultValue
    const availableLiquidityPercent =
      withdrawAssetPercent / (withdrawAssetPercent + leveragedPercent)
    const availableLiquidity = availableLiquidityPercent * fullVaultValue

    return {
      requiresLeveragedCollateralLiquidity: sendTokenValue > availableLiquidity,
      leveragedCollateralValueFormatted: formatToUsd({
        value: availableLiquidity,
      }),
    }
  }

  return {
    requiresLeveragedCollateralLiquidity: sendTokenValue > withdrawAssetValue,
    leveragedCollateralValueFormatted: formatToUsd({
      value: withdrawAssetValue,
    }),
  }
}
