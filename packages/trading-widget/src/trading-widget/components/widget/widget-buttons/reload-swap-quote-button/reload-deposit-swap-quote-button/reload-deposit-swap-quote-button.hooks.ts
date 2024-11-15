import { EASY_SWAPPER_V2_DEPOSIT_METHODS } from 'core-kit/const'
import {
  useSwapDataBasedOnSendToken,
  useVaultDepositParams,
} from 'core-kit/hooks/trading/deposit-v2'
import type { DepositMethodName } from 'core-kit/types'

const DEPOSIT_METHODS_WITH_SWAP: DepositMethodName[] = [
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT,
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_DEPOSIT_CUSTOM,
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT,
  EASY_SWAPPER_V2_DEPOSIT_METHODS.ZAP_NATIVE_DEPOSIT_CUSTOM,
]

interface UseReloadDepositSwapQuoteButtonReturn {
  showButton: boolean
  refetch: ReturnType<typeof useSwapDataBasedOnSendToken>['refetch']
  disabled: boolean
}

export const useReloadDepositSwapQuoteButton =
  (): UseReloadDepositSwapQuoteButtonReturn => {
    const { depositMethod } = useVaultDepositParams()
    const showButton = DEPOSIT_METHODS_WITH_SWAP.includes(depositMethod)
    const { refetch, data: swapData } = useSwapDataBasedOnSendToken()

    return { showButton, refetch, disabled: !swapData }
  }
