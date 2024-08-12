import { DEPOSIT_LOCKTIME_MAP } from 'core-kit/const'

import { useVaultDepositParams } from './use-vault-deposit-params'

export const useDepositLockTime = () => {
  const { depositMethod } = useVaultDepositParams()

  return DEPOSIT_LOCKTIME_MAP[depositMethod]
}
