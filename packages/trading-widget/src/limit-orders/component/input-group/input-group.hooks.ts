import { useAssetPrice } from 'core-kit/hooks/trading'
import { formatToUsd } from 'core-kit/utils'
import {
  useLimitOrderActions,
  useLimitOrderState,
} from 'limit-orders/hooks/state'

export const useInputGroup = () => {
  const {
    form: { takeProfitPrice, stopLossPrice, termsAccepted },
    pricingAsset,
    vaultChainId,
  } = useLimitOrderState()
  const { setTakeProfitPrice, setStopLossPrice, setTermsAccepted } =
    useLimitOrderActions()
  const pricingAssetPrice = useAssetPrice({
    address: pricingAsset,
    chainId: vaultChainId,
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
  }
}
