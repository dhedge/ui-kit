import { EASY_SWAPPER_V2_DEPOSIT_METHODS } from 'core-kit/const'
import {
  useSwapDataBasedOnSendToken,
  useVaultDepositParams,
} from 'core-kit/hooks/trading/deposit-v2'
import { useInvalidateTradingQueries } from 'core-kit/hooks/web3'
import type { DepositMethodName } from 'core-kit/types'

const DEPOSIT_METHODS_WITH_SWAP: DepositMethodName[] = [
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT,
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT_CUSTOM,
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT,
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT_CUSTOM,
]

interface UseReloadDepositSwapQuoteButtonReturn {
  showButton: boolean
  handleSwapQuoteReload: () => void
  disabled: boolean
}

export const useReloadDepositSwapQuoteButton =
  (): UseReloadDepositSwapQuoteButtonReturn => {
    const { depositMethod } = useVaultDepositParams()
    const showButton = DEPOSIT_METHODS_WITH_SWAP.includes(depositMethod)
    const { refetch, isFetched } = useSwapDataBasedOnSendToken()
    const { invalidateTradingQueries } = useInvalidateTradingQueries()

    const handleSwapQuoteReload = () => {
      invalidateTradingQueries()
      refetch()
    }

    return { showButton, handleSwapQuoteReload, disabled: !isFetched }
  }
