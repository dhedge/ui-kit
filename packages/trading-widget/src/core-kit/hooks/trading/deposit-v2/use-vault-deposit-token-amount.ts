import BigNumber from 'bignumber.js'

import { useSendTokenInput } from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'

import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'
import { useSwapDataBasedOnSendToken } from './use-swap-data-based-on-send-token'

export const useVaultDepositTokenAmount = () => {
  const [sendToken] = useSendTokenInput()
  const debouncedSendTokenValue = useDebounce(sendToken.value, 500)
  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()

  const { data } = useSwapDataBasedOnSendToken()
  return isDepositWithSwapTransaction
    ? data?.dstAmount
    : new BigNumber(debouncedSendTokenValue || '0')
        .shiftedBy(sendToken.decimals)
        .toFixed(0)
}
