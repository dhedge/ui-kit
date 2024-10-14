import BigNumber from 'bignumber.js'

import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useExpectedReceiveSwapAmount } from 'core-kit/hooks/trading/withdraw-v2/swap-step/use-expected-receive-swap-amount'

export const useSwapReceiveValueDiff = () => {
  const { expectedReceiveAmount: sendAmount } = useExpectedReceiveSwapAmount()
  const [receiveToken] = useReceiveTokenInput()
  const estimatedReceiveAmount = new BigNumber(
    receiveToken.value || '0',
  ).shiftedBy(receiveToken.decimals)

  if (sendAmount === '0' || estimatedReceiveAmount.isZero()) {
    return 0
  }

  return estimatedReceiveAmount
    .dividedBy(sendAmount)
    .minus(1)
    .times(100)
    .decimalPlaces(2, BigNumber.ROUND_DOWN)
    .toNumber()
}
