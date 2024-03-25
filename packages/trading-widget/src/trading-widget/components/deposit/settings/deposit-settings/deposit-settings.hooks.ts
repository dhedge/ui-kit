import { usePoolFees } from 'core-kit/hooks/pool'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useDepositSettings = () => {
  const { customLockTime, defaultLockTime } = useConfigContextParams()
  const { address, chainId } = useTradingPanelPoolConfig()
  const { hasPoolEntryFee } = usePoolFees({ address, chainId })

  return {
    customLockTime,
    defaultLockTime,
    hasPoolEntryFee,
  }
}