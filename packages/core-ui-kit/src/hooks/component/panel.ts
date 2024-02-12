import { useInvalidatePoolContractData } from 'hooks/pool'
import { useHandlePoolSwapInfo, useTradingResultHandling } from 'hooks/trading'
import { useHandlePoolDepositData } from 'hooks/trading/deposit'

export const useGeneralTradingPanelHandlers = () => {
  useTradingResultHandling()
  useHandlePoolSwapInfo()
  useHandlePoolDepositData()
  useInvalidatePoolContractData()
}
