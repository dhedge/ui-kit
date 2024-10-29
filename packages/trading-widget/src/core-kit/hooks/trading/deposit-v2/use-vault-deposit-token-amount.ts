import BigNumber from 'bignumber.js'

import { useSendTokenInput } from 'core-kit/hooks/state'
import { useSendTokenDebouncedValue } from 'core-kit/hooks/trading'

import { useIsDepositWithSwapTransaction } from './use-is-deposit-with-swap-transaction'
import { useSwapDataBasedOnSendToken } from './use-swap-data-based-on-send-token'

export const useVaultDepositTokenAmount = () => {
  const [sendToken] = useSendTokenInput()
  const { debouncedSendTokenValue } = useSendTokenDebouncedValue()

  const isDepositWithSwapTransaction = useIsDepositWithSwapTransaction()

  const { data } = useSwapDataBasedOnSendToken()
  return isDepositWithSwapTransaction
    ? (data?.destinationAmount ?? '0')
    : new BigNumber(debouncedSendTokenValue || '0')
        .shiftedBy(sendToken.decimals)
        .toFixed(0)
}
