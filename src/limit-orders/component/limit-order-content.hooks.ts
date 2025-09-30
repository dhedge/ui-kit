import { useLimitOrderState } from 'limit-orders/hooks/state'

const isValidNumber = (value?: string | null) => {
  const trimmed = value?.trim()
  if (!trimmed) return false
  return !isNaN(Number(trimmed))
}

export const useLimitOrderContent = () => {
  const {
    form: { lowerLimitPrice, upperLimitPrice },
  } = useLimitOrderState()

  const hasLowerLimitPriceD18 =
    isValidNumber(lowerLimitPrice) && Number(lowerLimitPrice) !== 0
  const hasUpperLimitPriceD18 = isValidNumber(upperLimitPrice)

  const limitOrderButtonDisabled =
    !hasLowerLimitPriceD18 && !hasUpperLimitPriceD18

  return { limitOrderButtonDisabled }
}
