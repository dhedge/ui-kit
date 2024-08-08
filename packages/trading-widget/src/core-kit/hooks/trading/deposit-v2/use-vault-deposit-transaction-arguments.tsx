import { useMemo } from 'react'

import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import type { VaultDepositParams } from 'core-kit/types'

import { useVaultDepositTokenAmount } from './use-vault-deposit-token-amount'

export const useVaultDepositTransactionArguments = ({
  depositMethod,
  vaultDepositTokenAddress,
}: VaultDepositParams): unknown[] => {
  const { address } = useTradingPanelPoolConfig()
  const vaultDepositTokenAmount = useVaultDepositTokenAmount()

  return useMemo(() => {
    switch (depositMethod) {
      case 'deposit':
      case 'depositWithCustomCooldown':
        return [address, vaultDepositTokenAddress, vaultDepositTokenAmount]
      case 'nativeDeposit':
      case 'nativeDepositWithCustomCooldown':
        return [address, { value: vaultDepositTokenAmount }]
      case 'zapNativeDeposit':
        return [] as unknown[]
      case 'zapNativeDepositWithCustomCooldown':
        return [] as unknown[]
      case 'zapDeposit':
        return [] as unknown[]
      case 'zapDepositWithCustomCooldown':
        return [] as unknown[]
      default:
        return [] as unknown[]
    }
  }, [
    address,
    depositMethod,
    vaultDepositTokenAddress,
    vaultDepositTokenAmount,
  ])
}
