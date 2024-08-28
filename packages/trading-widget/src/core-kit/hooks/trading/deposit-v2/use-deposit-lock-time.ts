import { formatDuration } from 'date-fns'

import { DEFAULT_LOCK_TIME } from 'core-kit/const'
import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'

import { useVaultDepositParams } from './use-vault-deposit-params'

export const useDepositLockTime = () => {
  const { chainId, address } = useTradingPanelPoolConfig()
  const { data: { customCooldown } = {} } = usePoolStatic({
    address,
    chainId,
  })
  const { depositMethod } = useVaultDepositParams()

  const customLockTime = customCooldown
    ? formatDuration({ minutes: Number(customCooldown) / 60 })
    : DEFAULT_LOCK_TIME

  switch (depositMethod) {
    case 'depositWithCustomCooldown':
    case 'nativeDepositWithCustomCooldown':
    case 'zapDepositWithCustomCooldown':
    case 'zapNativeDepositWithCustomCooldown':
      return customLockTime
    default:
      return DEFAULT_LOCK_TIME
  }
}
