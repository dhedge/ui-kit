import { useSendTokenInput } from 'core-kit/hooks/state'
import { useVaultDepositParams } from 'core-kit/hooks/trading/deposit-v2/use-vault-deposit-params'
import { isEqualAddress } from 'core-kit/utils'

export const useIsDepositWithSwapTransaction = () => {
  const [sendToken] = useSendTokenInput()
  const { vaultDepositTokenAddress } = useVaultDepositParams()

  return !isEqualAddress(sendToken.address, vaultDepositTokenAddress)
}
