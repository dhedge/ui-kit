import { EXTREMELY_SHORT_POLLING_INTERVAL } from 'core-kit/const'
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
    refetchInterval: EXTREMELY_SHORT_POLLING_INTERVAL,
  })

  const takeProfitPriceDifference = calculateProfitPriceDifference({
    price: takeProfitPrice,
    markPrice: pricingAssetPrice,
  })
  const stopLossPriceDifference = calculateLossPriceDifference({
    price: stopLossPrice,
    markPrice: pricingAssetPrice,
  })

  const takeProfitInputLabel = isReversedOrder
    ? t.stopLossLabel
    : t.takeProfitLabel
  const stopLossInputLabel = isReversedOrder
    ? t.takeProfitLabel
    : t.stopLossLabel

  return {
    takeProfitPrice,
    stopLossPrice,
    setTakeProfitPrice,
    setStopLossPrice,
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
  }
}
