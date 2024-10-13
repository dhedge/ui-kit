import { useInvalidatePoolContractData } from 'core-kit/hooks/pool'
import { useTradingResultHandling } from 'core-kit/hooks/trading'
import { useHandlePoolDepositData } from 'core-kit/hooks/trading/deposit-v2'
import { useIsWithdrawSwapStep } from 'core-kit/hooks/trading/withdraw-v2/swap-step'

export const useGeneralTradingPanelHandlers = () => {
  useTradingResultHandling()
  useHandlePoolDepositData()
  useInvalidatePoolContractData()
  useIsWithdrawSwapStep() // Added in order to prefetch withdraw assets
}
