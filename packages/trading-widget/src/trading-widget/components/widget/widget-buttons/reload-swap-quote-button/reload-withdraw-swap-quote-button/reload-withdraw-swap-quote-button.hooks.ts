import {
  useCompleteWithdrawSwapData,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'

interface UseReloadWithdrawSwapQuoteButtonReturn {
  showButton: boolean
  refetch: ReturnType<typeof useCompleteWithdrawSwapData>['refetch']
  disabled: boolean
}

export const useReloadWithdrawSwapQuoteButton =
  (): UseReloadWithdrawSwapQuoteButtonReturn => {
    const showButton = useHasSwappableAssets()
    const { refetch, data: swapData } = useCompleteWithdrawSwapData()

    return { showButton, refetch, disabled: !swapData }
  }
