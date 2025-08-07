import { useCallback } from 'react'

import { SHORTEN_POLLING_INTERVAL } from 'core-kit/const'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { formatToUsd } from 'core-kit/utils'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'
import { useLimitOrderCoveredVaultAmount } from 'limit-orders/hooks/use-limit-order-covered-vault-amount'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'
import {
  calculateLossPriceDifference,
  calculateProfitPriceDifference,
} from 'limit-orders/utils'

export const useInputGroup = () => {
  const t = useTranslationContext()
  const {
    form: { upperLimitPrice, lowerLimitPrice, sellPercentage, termsAccepted },
    pricingAsset,
    vaultChainId,
  } = useLimitOrderState()
  const {
    setUpperLimitPrice,
    setLowerLimitPrice,
    setSellPercentage,
    setTermsAccepted,
  } = useLimitOrderActions()
  const pricingAssetPrice = useAssetPrice({
    address: pricingAsset.address,
    chainId: vaultChainId,
    refetchInterval: SHORTEN_POLLING_INTERVAL,
  })
  const { formatted: coveredVaultAmount, symbol: vaultSymbol } =
    useLimitOrderCoveredVaultAmount()

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

  const onDisableSellPercentage = useCallback(() => {
    setSellPercentage('')
  }, [setSellPercentage])

  const inputSuffix = `${pricingAsset.symbol} ${t.price}`

  return {
    upperLimitPrice,
    lowerLimitPrice,
    sellPercentage,
    setUpperLimitPrice,
    setLowerLimitPrice,
    setSellPercentage,
    onDisableUpperLimitPrice,
    onDisableLowerLimitPrice,
    onDisableSellPercentage,
    termsAccepted,
    setTermsAccepted,
    pricingAssetPrice:
      pricingAssetPrice === '0'
        ? null
        : formatToUsd({
            value: pricingAssetPrice,
          }),
    upperLimitPriceDifference,
    lowerLimitPriceDifference,
    pricingAssetSymbol: pricingAsset.symbol,
    inputSuffix,
    coveredVaultAmount,
    vaultSymbol,
  }
}
