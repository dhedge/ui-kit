import BigNumber from 'bignumber.js'

import {
  AddressZero,
  SYNTHETIX_V3_VAULTS_WITHDRAW_ASSET_SYMBOL_MAP,
} from 'core-kit/const'
import { usePoolCompositionWithFraction } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useRawAssetPrice } from 'core-kit/hooks/trading/use-raw-asset-price'
import {
  isEqualAddress,
  isSynthetixV3Asset,
  isSynthetixV3Vault,
  normalizeNumber,
} from 'core-kit/utils'

import { useAvailableWithdrawLiquidity } from './use-available-withdraw-liquidity'

export const useWithdrawLiquidity = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [sendToken] = useSendTokenInput()
  const isSynthetixVault = isSynthetixV3Vault(address)

  const { data: availableLiquidity } = useAvailableWithdrawLiquidity({
    enabled: isSynthetixVault,
  })
  const availableLiquidityAssetPriceUsd = useRawAssetPrice({
    address: availableLiquidity?.address ?? AddressZero,
    chainId,
    disabled:
      !availableLiquidity ||
      isEqualAddress(availableLiquidity?.address, AddressZero),
  })
  const poolComposition = usePoolCompositionWithFraction({
    vaultTokensAmount: sendToken.value,
    address,
    chainId,
  })
  const snxFractionUsd =
    poolComposition.find(({ tokenAddress }) => isSynthetixV3Asset(tokenAddress))
      ?.fractionUsdNumber ?? 0

  return {
    noLiquidity: new BigNumber(availableLiquidity?.value ?? '0')
      .multipliedBy(
        normalizeNumber(availableLiquidityAssetPriceUsd?.toString() ?? '0'),
      )
      .lt(snxFractionUsd),
    symbol: SYNTHETIX_V3_VAULTS_WITHDRAW_ASSET_SYMBOL_MAP[address] ?? '',
    availableLiquidity: availableLiquidity?.formatted,
  }
}
