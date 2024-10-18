import BigNumber from 'bignumber.js'

import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useCompleteWithdrawExpectedAmount } from 'core-kit/hooks/trading/withdraw-v2/complete-step/use-complete-withdraw-expected-amount'

export const useCompleteWithdrawReceiveDiff = () => {
  const { expectedReceiveAmountD18: sendAmountD18 } =
    useCompleteWithdrawExpectedAmount()
  const [receiveToken] = useReceiveTokenInput()
  const estimatedReceiveAmount = new BigNumber(
    receiveToken.value || '0',
  ).shiftedBy(receiveToken.decimals)

  if (sendAmountD18 === '0' || estimatedReceiveAmount.isZero()) {
    return 0
  }

  return estimatedReceiveAmount
    .dividedBy(sendAmountD18)
    .minus(1)
    .times(100)
    .decimalPlaces(2, BigNumber.ROUND_DOWN)
    .toNumber()
}
