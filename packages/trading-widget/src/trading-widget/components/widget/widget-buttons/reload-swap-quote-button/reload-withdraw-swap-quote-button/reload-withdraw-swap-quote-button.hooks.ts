import { useCompleteWithdrawSwapData } from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useInvalidateTradingQueries } from 'core-kit/hooks/web3'

interface UseReloadWithdrawSwapQuoteButtonReturn {
  handleSwapQuoteReload: () => void
  disabled: boolean
}

export const useReloadWithdrawSwapQuoteButton =
  (): UseReloadWithdrawSwapQuoteButtonReturn => {
    const { refetch, isFetched } = useCompleteWithdrawSwapData()
    const { invalidateTradingQueries } = useInvalidateTradingQueries()

    const handleSwapQuoteReload = () => {
      invalidateTradingQueries()
      refetch()
    }

    return { handleSwapQuoteReload, disabled: !isFetched }
  }
