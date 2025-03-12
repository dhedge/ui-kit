import { useAssetPrice } from 'core-kit/hooks/trading'
import { formatToUsd } from 'core-kit/utils'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'
import {
  calculateLossPriceDifference,
  calculateProfitPriceDifference,
} from 'limit-orders/utils'

export const useInputGroup = () => {
  const {
    form: { takeProfitPrice, stopLossPrice, termsAccepted },
    pricingAsset,
    vaultChainId,
  } = useLimitOrderState()
  const { setTakeProfitPrice, setStopLossPrice, setTermsAccepted } =
    useLimitOrderActions()
  const pricingAssetPrice = useAssetPrice({
    address: pricingAsset.address,
    chainId: vaultChainId,
  })

  const takeProfitPriceDifference = calculateProfitPriceDifference({
    price: takeProfitPrice,
    markPrice: pricingAssetPrice,
  })
  const stopLossPriceDifference = calculateLossPriceDifference({
    price: stopLossPrice,
    markPrice: pricingAssetPrice,
  })

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
  }
}
