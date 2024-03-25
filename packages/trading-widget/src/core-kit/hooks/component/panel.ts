import { useInvalidatePoolContractData } from 'core-kit/hooks/pool'
import {
  useHandlePoolSwapInfo,
  useTradingResultHandling,
} from 'core-kit/hooks/trading'
import { useHandlePoolDepositData } from 'core-kit/hooks/trading/deposit'

export const useGeneralTradingPanelHandlers = () => {
  useTradingResultHandling()
  useHandlePoolSwapInfo()
  useHandlePoolDepositData()
  useInvalidatePoolContractData()
}
