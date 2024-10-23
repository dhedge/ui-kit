import {
  useCompleteWithdrawQuote,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'

export const useCompleteStep = () => {
  useCompleteWithdrawQuote()
  const hasSwappableAssets = useHasSwappableAssets()

  return { hasSwappableAssets }
}
