import { useInvalidatePoolContractData } from 'core-kit/hooks/pool'
import { useTradingResultHandling } from 'core-kit/hooks/trading'
import { useHandlePoolDepositData } from 'core-kit/hooks/trading/deposit-v2'
import { useWithdrawTrackedAssets } from 'core-kit/hooks/trading/withdraw-v2/swap-step'

export const useGeneralTradingPanelHandlers = () => {
  useTradingResultHandling()
  useHandlePoolDepositData()
  useInvalidatePoolContractData()
  useWithdrawTrackedAssets() // Added in order to prefetch withdraw assets to prevent flickering
}
