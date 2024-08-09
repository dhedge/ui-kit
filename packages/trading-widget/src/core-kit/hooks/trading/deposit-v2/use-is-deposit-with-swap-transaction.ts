import { useSendTokenInput } from 'core-kit/hooks/state'
import { isEqualAddress } from 'core-kit/utils'

import { useVaultDepositParams } from './use-vault-deposit-params'

export const useIsDepositWithSwapTransaction = () => {
  const [sendToken] = useSendTokenInput()
  const { vaultDepositTokenAddress } = useVaultDepositParams()

  return !isEqualAddress(sendToken.address, vaultDepositTokenAddress)
}
