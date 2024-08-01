import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { usePoolDepositAssetAddress } from 'core-kit/hooks/trading/deposit'
import { useAssetPrice } from 'core-kit/hooks/trading/use-asset-price'
import type { TradingParams } from 'core-kit/types/trading.types'

export const useDepositTradingParams = (): TradingParams => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const [{ slippage }] = useTradingPanelSettings()
  const isAutoSlippage = slippage === 'auto'

  const [sendToken] = useSendTokenInput()
  const sendTokenPrice =
    useAssetPrice({
      address: sendToken.address,
      chainId,
      disabled: isAutoSlippage,
    }) ?? ''

  const [receiveToken] = useReceiveTokenInput()
  const receiveAssetAddress = receiveToken.address
  const receiveAssetPrice =
    usePoolTokenPrice({ address, chainId, disabled: isAutoSlippage }) ?? ''

  const poolDepositAssetAddress = usePoolDepositAssetAddress({
    investAssetAddress: sendToken.address,
    symbol: sendToken.symbol,
    productPoolAddress: address,
    chainId,
  })
  const manualSlippageReceiveAssetAmount = new BigNumber(sendToken.value || '0')
    .multipliedBy(sendTokenPrice)
    .dividedBy(receiveAssetPrice)
    .toFixed()
  const receiveAssetAmount = isAutoSlippage
    ? receiveToken.value
    : manualSlippageReceiveAssetAmount

  return useMemo<TradingParams>(
    () => ({
      sendAssetAddress: sendToken.address,
      fromTokenAmount: new BigNumber(sendToken.value || '0'),
      receiveAssetAddress,
      receiveAssetAmount,
      poolDepositAddress: poolDepositAssetAddress,
    }),
    [
      sendToken.address,
      sendToken.value,
      receiveAssetAddress,
      receiveAssetAmount,
      poolDepositAssetAddress,
    ],
  )
}
