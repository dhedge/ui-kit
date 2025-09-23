import { MaxUint256 } from 'core-kit/const'
import { useLimitOrderState } from 'limit-orders/hooks/state'

export const useLimitOrderContent = () => {
  const {
    form: { lowerLimitPrice, upperLimitPrice },
  } = useLimitOrderState()

  const hasLowerLimitPriceD18 =
    !!lowerLimitPrice && BigInt(lowerLimitPrice) !== BigInt(0)
  const hasUpperLimitPriceD18 =
    !!upperLimitPrice && BigInt(upperLimitPrice) !== MaxUint256

  const limitOrderButtonDisabled =
    !hasLowerLimitPriceD18 && !hasUpperLimitPriceD18

  return { limitOrderButtonDisabled }
}
