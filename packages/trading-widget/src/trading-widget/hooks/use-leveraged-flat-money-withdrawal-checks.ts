import BigNumber from 'bignumber.js'

import { AddressZero, DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolComposition, usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import {
  formatToUsd,
  getFlatMoneyCollateralByLeverageAddress,
  isEqualAddress,
  isFlatMoneyLeveragedAsset,
} from 'core-kit/utils'

export const useLeveragedFlatMoneyWithdrawalChecks = () => {
  const config = useTradingPanelPoolConfig()
  const composition = usePoolComposition(config)
  const [sendToken] = useSendTokenInput()
  const vaultTokenPrice = usePoolTokenPrice(config)

  const leveragedFlatMoneyPositionAsset = composition.find(
    ({ tokenAddress, amount }) =>
      isFlatMoneyLeveragedAsset(tokenAddress) && amount !== '0',
  )
  const collateralAddress = getFlatMoneyCollateralByLeverageAddress(
    leveragedFlatMoneyPositionAsset?.tokenAddress ?? AddressZero,
  ).address

  const collateral = composition.find(({ tokenAddress }) =>
    isEqualAddress(collateralAddress, tokenAddress),
  )

  if (!leveragedFlatMoneyPositionAsset || !collateral) {
    return {
      requiresLeveragedCollateralLiquidity: false,
      leveragedCollateralValueFormatted: '$0',
    }
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
