import { useCallback } from 'react'

import { SHORTEN_POLLING_INTERVAL } from 'core-kit/const'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { formatToUsd } from 'core-kit/utils'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'
import {
  calculateLossPriceDifference,
  calculateProfitPriceDifference,
} from 'limit-orders/utils'

export const useInputGroup = () => {
  const t = useTranslationContext()
  const {
    form: { takeProfitPrice, stopLossPrice, termsAccepted },
    pricingAsset,
    vaultChainId,
    isReversedOrder,
  } = useLimitOrderState()
  const { setTakeProfitPrice, setStopLossPrice, setTermsAccepted } =
    useLimitOrderActions()
  const pricingAssetPrice = useAssetPrice({
    address: pricingAsset.address,
    chainId: vaultChainId,
    refetchInterval: SHORTEN_POLLING_INTERVAL,
  })

  const takeProfitPriceDifference = calculateProfitPriceDifference({
    price: takeProfitPrice,
    markPrice: pricingAssetPrice,
  })
  const stopLossPriceDifference = calculateLossPriceDifference({
    price: stopLossPrice,
    markPrice: pricingAssetPrice,
  })

  const onDisableTakeProfitPrice = useCallback(() => {
    setTakeProfitPrice('')
  }, [setTakeProfitPrice])

  const onDisableStopLossPrice = useCallback(() => {
    setStopLossPrice('')
  }, [setStopLossPrice])

  const takeProfitInputLabel = isReversedOrder
    ? t.stopLossLabel
    : t.takeProfitLabel
  const takeProfitInputSubtitle = isReversedOrder
    ? t.stopLossSubtitle
    : t.takeProfitSubtitle
  const stopLossInputLabel = isReversedOrder
    ? t.takeProfitLabel
    : t.stopLossLabel
  const stopLossInputSubtitle = isReversedOrder
    ? t.takeProfitSubtitle
    : t.stopLossSubtitle
  const inputSuffix = `${pricingAsset.symbol} ${t.price}`

  return {
    takeProfitPrice,
    stopLossPrice,
    setTakeProfitPrice,
    setStopLossPrice,
    onDisableTakeProfitPrice,
    onDisableStopLossPrice,
    termsAccepted,
    setTermsAccepted,
    pricingAssetPrice:
      pricingAssetPrice === '0'
        ? null
        : formatToUsd({
            value: pricingAssetPrice,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
    takeProfitPriceDifference,
    stopLossPriceDifference,
    pricingAssetSymbol: pricingAsset.symbol,
    isReversedOrder,
    takeProfitInputLabel,
    stopLossInputLabel,
    takeProfitInputSubtitle,
    stopLossInputSubtitle,
    inputSuffix,
  }
}
