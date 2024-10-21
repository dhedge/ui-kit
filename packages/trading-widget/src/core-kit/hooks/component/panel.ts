import { useInvalidatePoolContractData } from 'core-kit/hooks/pool'
import { useTradingResultHandling } from 'core-kit/hooks/trading'
import { useHandlePoolDepositData } from 'core-kit/hooks/trading/deposit-v2'
import { useCompleteWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/complete-step'

export const useGeneralTradingPanelHandlers = () => {
  useTradingResultHandling()
  useHandlePoolDepositData()
  useInvalidatePoolContractData()
  useCompleteWithdrawTrackedAssets() // Added in order to prefetch withdraw assets to prevent flickering
}
