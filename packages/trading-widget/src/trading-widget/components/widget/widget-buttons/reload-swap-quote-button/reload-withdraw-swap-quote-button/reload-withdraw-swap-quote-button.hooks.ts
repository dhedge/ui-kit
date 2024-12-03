import {
  useCompleteWithdrawSwapData,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useInvalidateTradingQueries } from 'core-kit/hooks/web3'

interface UseReloadWithdrawSwapQuoteButtonReturn {
  showButton: boolean
  handleSwapQuoteReload: () => void
  disabled: boolean
}

export const useReloadWithdrawSwapQuoteButton =
  (): UseReloadWithdrawSwapQuoteButtonReturn => {
    const showButton = useHasSwappableAssets()
    const { refetch, isFetched } = useCompleteWithdrawSwapData()
    const { invalidateTradingQueries } = useInvalidateTradingQueries()

    const handleSwapQuoteReload = () => {
      invalidateTradingQueries()
      refetch()
    }

    return { showButton, handleSwapQuoteReload, disabled: !isFetched }
  }
