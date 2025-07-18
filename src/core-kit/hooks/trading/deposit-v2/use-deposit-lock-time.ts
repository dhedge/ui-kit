import { formatDuration } from 'date-fns'

import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useDepositLockTime = () => {
  const { defaultLockTime } = useConfigContextParams()
  const { chainId, address } = useTradingPanelPoolConfig()
  const { data: { customCooldown } = {} } = usePoolStatic({
    address,
    chainId,
  })
  const { depositMethod } = useVaultDepositParams()

  const customLockTime = customCooldown
    ? formatDuration({ minutes: Number(customCooldown) / 60 })
    : defaultLockTime

  switch (depositMethod) {
    case 'depositWithCustomCooldown':
    case 'nativeDepositWithCustomCooldown':
    case 'zapDepositWithCustomCooldown':
    case 'zapNativeDepositWithCustomCooldown':
      return customLockTime
    default:
      return defaultLockTime
  }
}
