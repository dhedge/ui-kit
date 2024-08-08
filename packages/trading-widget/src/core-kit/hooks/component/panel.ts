import { useInvalidatePoolContractData } from 'core-kit/hooks/pool'
import { useTradingResultHandling } from 'core-kit/hooks/trading'
import { useHandlePoolDepositData } from 'core-kit/hooks/trading/deposit-v2'

export const useGeneralTradingPanelHandlers = () => {
  useTradingResultHandling()
  useHandlePoolDepositData()
  useInvalidatePoolContractData()
}
