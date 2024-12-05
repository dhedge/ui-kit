import { useSwapDataBasedOnSendToken } from 'core-kit/hooks/trading/deposit-v2'
import { useInvalidateTradingQueries } from 'core-kit/hooks/web3'

interface UseReloadDepositSwapQuoteButtonReturn {
  handleSwapQuoteReload: () => void
  disabled: boolean
}

export const useReloadDepositSwapQuoteButton =
  (): UseReloadDepositSwapQuoteButtonReturn => {
    const { refetch, isFetched } = useSwapDataBasedOnSendToken()
    const { invalidateTradingQueries } = useInvalidateTradingQueries()

    const handleSwapQuoteReload = () => {
      invalidateTradingQueries()
      refetch()
    }

    return { handleSwapQuoteReload, disabled: !isFetched }
  }
