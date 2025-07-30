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
  getGmxCollateralByLeverageAddress,
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
  getCollateralByLeverageAddress: (address: Address) => CollateralInfo
  isLentAndBorrowedAsset: (params: IsLendAndBorrowAssetParams) => boolean
}

const LEVERAGED_ASSET_CONFIGS: LeveragedAssetConfig[] = [
  {
    isLeveragedAsset: isFlatMoneyLeveragedAsset,
    getCollateralByLeverageAddress: getFlatMoneyCollateralByLeverageAddress,
    isLentAndBorrowedAsset: isAaveLendAndBorrowAsset,
  },
  {
    isLeveragedAsset: isGmxLeveragedAsset,
    getCollateralByLeverageAddress: getGmxCollateralByLeverageAddress,
    isLentAndBorrowedAsset: () => false,
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

  const collateralAddress = assetConfig.getCollateralByLeverageAddress(
    leveragedPosition.tokenAddress as Address,
  ).address

  const collateral = composition.find(({ tokenAddress }) =>
    isEqualAddress(collateralAddress, tokenAddress),
  )

  if (!collateral) {
    return DEFAULT_RESULT
  }

  const sendTokenValue =
    Number(sendToken.value || '0') * Number(vaultTokenPrice)
  const collateralValue = calculateAssetValue(collateral)

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

    // % available withdraw liquidity = % collateral / (% collateral + % leverage position)
    const collateralPercent = collateralValue / fullVaultValue
    const leveragedPercent = leveragedPositionValue / fullVaultValue
    const availableLiquidityPercent =
      collateralPercent / (collateralPercent + leveragedPercent)
    const availableLiquidity = availableLiquidityPercent * fullVaultValue

    return {
      requiresLeveragedCollateralLiquidity: sendTokenValue > availableLiquidity,
      leveragedCollateralValueFormatted: formatToUsd({
        value: availableLiquidity,
      }),
    }
  }

  return {
    requiresLeveragedCollateralLiquidity: sendTokenValue > collateralValue,
    leveragedCollateralValueFormatted: formatToUsd({ value: collateralValue }),
  }
}
