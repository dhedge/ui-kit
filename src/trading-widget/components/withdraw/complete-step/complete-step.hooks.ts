import {
  useCompleteWithdrawQuote,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step'

export const useCompleteStep = () => {
  useCompleteWithdrawQuote()
  const hasSwappableAssets = useHasSwappableAssets()
  const isMultiAssetWithdraw = useIsMultiAssetWithdraw()
  const showSwapButton = hasSwappableAssets && !isMultiAssetWithdraw

  return { showSwapButton }
}
