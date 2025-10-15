import BigNumber from 'bignumber.js'

import { useSendTokenInput } from 'core-kit/hooks/state'

export const useLimitOrderWithdrawAmount = () => {
  const [sendToken] = useSendTokenInput()

  return new BigNumber(sendToken.value || '0').shiftedBy(sendToken.decimals)
}
