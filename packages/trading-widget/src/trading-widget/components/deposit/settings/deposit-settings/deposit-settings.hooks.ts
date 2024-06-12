import { usePoolFees } from 'core-kit/hooks/pool'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

import { useIsEasySwapperTrading } from 'core-kit/hooks/trading/use-is-easy-swapper-trading'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useDepositSettings = () => {
  const { customLockTime, defaultLockTime } = useConfigContextParams()
  const { address, chainId } = useTradingPanelPoolConfig()
  const { hasPoolEntryFee } = usePoolFees({ address, chainId })
  const isEasySwapperTrading = useIsEasySwapperTrading()

  return {
    customLockTime,
    defaultLockTime,
    hasPoolEntryFee,
    isEasySwapperTrading,
  }
}
