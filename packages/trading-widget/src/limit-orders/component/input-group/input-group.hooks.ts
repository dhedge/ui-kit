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
    form: { upperLimitPrice, lowerLimitPrice, termsAccepted },
    pricingAsset,
    vaultChainId,
  } = useLimitOrderState()
  const { setUpperLimitPrice, setLowerLimitPrice, setTermsAccepted } =
    useLimitOrderActions()
  const pricingAssetPrice = useAssetPrice({
    address: pricingAsset.address,
    chainId: vaultChainId,
    refetchInterval: SHORTEN_POLLING_INTERVAL,
  })

  const upperLimitPriceDifference = calculateProfitPriceDifference({
    price: upperLimitPrice,
    markPrice: pricingAssetPrice,
  })
  const lowerLimitPriceDifference = calculateLossPriceDifference({
    price: lowerLimitPrice,
    markPrice: pricingAssetPrice,
  })

  const onDisableUpperLimitPrice = useCallback(() => {
    setUpperLimitPrice('')
  }, [setUpperLimitPrice])

  const onDisableLowerLimitPrice = useCallback(() => {
    setLowerLimitPrice('')
  }, [setLowerLimitPrice])

  const inputSuffix = `${pricingAsset.symbol} ${t.price}`

  return {
    upperLimitPrice,
    lowerLimitPrice,
    setUpperLimitPrice,
    setLowerLimitPrice,
    onDisableUpperLimitPrice,
    onDisableLowerLimitPrice,
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
    upperLimitPriceDifference,
    lowerLimitPriceDifference,
    pricingAssetSymbol: pricingAsset.symbol,
    inputSuffix,
  }
}
