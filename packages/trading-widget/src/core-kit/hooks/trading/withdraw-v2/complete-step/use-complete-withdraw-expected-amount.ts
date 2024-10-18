import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useRawAssetPrice } from 'core-kit/hooks/trading/use-raw-asset-price'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useCompleteWithdrawTotalUsdValue } from 'core-kit/hooks/trading/withdraw-v2/complete-step'

export const useCompleteWithdrawExpectedAmount = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const rawPrice = useRawAssetPrice({ address: receiveToken.address, chainId })
  const slippage = useAppliedWithdrawSlippage()

  const totalUsdAmountToBeSwapped = useCompleteWithdrawTotalUsdValue()

  const expectedReceiveAmountD18 = new BigNumber(totalUsdAmountToBeSwapped)
    .shiftedBy(DEFAULT_PRECISION)
    .div(rawPrice?.toString() ?? '1')
    .shiftedBy(receiveToken.decimals)
    .toFixed(0, BigNumber.ROUND_DOWN)

  const minExpectedReceiveAmountD18 = new BigNumber(expectedReceiveAmountD18)
    .times(1 - slippage / 100)
    .toFixed(0, BigNumber.ROUND_DOWN)

  return { expectedReceiveAmountD18, minExpectedReceiveAmountD18 }
}
