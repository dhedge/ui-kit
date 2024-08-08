import BigNumber from 'bignumber.js'

import { useSendTokenInput } from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'
import { isEqualAddress } from 'core-kit/utils'

import { useSwapDataBasedOnSendToken } from './use-swap-data-based-on-send-token'
import { useVaultDepositParams } from './use-vault-deposit-params'

export const useVaultDepositTokenAmount = () => {
  const [sendToken] = useSendTokenInput()
  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)

  const { vaultDepositTokenAddress } = useVaultDepositParams()

  const isCustomDepositToken = !isEqualAddress(
    sendToken.address,
    vaultDepositTokenAddress,
  )
  const { data } = useSwapDataBasedOnSendToken()
  return isCustomDepositToken
    ? data?.dstAmount
    : new BigNumber(debouncedSendTokenValue || '0')
        .shiftedBy(sendToken.decimals)
        .toFixed(0)
}
