import BigNumber from 'bignumber.js'
import type { Address } from 'viem'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolComposition, usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import {
  formatToUsd,
  getFlatMoneyCollateralByLeverageAddress,
  getGmxCollateralByLeverageAddress,
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
}

const LEVERAGED_ASSET_CONFIGS: LeveragedAssetConfig[] = [
  {
    isLeveragedAsset: isFlatMoneyLeveragedAsset,
    getCollateralByLeverageAddress: getFlatMoneyCollateralByLeverageAddress,
  },
  {
    isLeveragedAsset: isGmxLeveragedAsset,
    getCollateralByLeverageAddress: getGmxCollateralByLeverageAddress,
  },
]

const DEFAULT_RESULT = {
  requiresLeveragedCollateralLiquidity: false,
  leveragedCollateralValueFormatted: '$0',
}

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
  const collateralValue = new BigNumber(collateral.amount)
    .shiftedBy(-collateral.precision)
    .times(collateral.rate)
    .shiftedBy(-DEFAULT_PRECISION)
    .toNumber()

  return {
    requiresLeveragedCollateralLiquidity: sendTokenValue > collateralValue,
    leveragedCollateralValueFormatted: formatToUsd({ value: collateralValue }),
  }
}
