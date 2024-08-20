import { CUSTOM_LOCK_TIME } from 'core-kit/const'
import { usePoolFees } from 'core-kit/hooks/pool'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

import { useIsEasySwapperTrading } from 'core-kit/hooks/trading/use-is-easy-swapper-trading'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useDepositSettings = () => {
  const { chainCustomLockTimeMap, defaultLockTime } = useConfigContextParams()
  const { address, chainId } = useTradingPanelPoolConfig()
  const { hasPoolEntryFee } = usePoolFees({ address, chainId })
  const isEasySwapperTrading = useIsEasySwapperTrading()
  const customLockTime = chainCustomLockTimeMap[chainId] ?? CUSTOM_LOCK_TIME

  return {
    customLockTime,
    defaultLockTime,
    hasPoolEntryFee,
    isEasySwapperTrading,
  }
}
