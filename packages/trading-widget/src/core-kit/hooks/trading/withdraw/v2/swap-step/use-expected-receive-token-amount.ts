import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useRawAssetPrice } from 'core-kit/hooks/trading/use-raw-asset-price'
import { useSwappedUsdValue } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-swapped-usd-value'
import { useWithdrawSlippage } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-slippage'

export const useExpectedReceiveTokenAmount = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const [receiveToken] = useReceiveTokenInput()
  const price = useRawAssetPrice({ address: receiveToken.address, chainId })
  const slippage = useWithdrawSlippage()

  const totalUsdAmountToBeSwapped = useSwappedUsdValue()

  const expectedReceiveAmount = new BigNumber(totalUsdAmountToBeSwapped)
    .shiftedBy(DEFAULT_PRECISION)
    .div(price?.toString() || '1')
    .shiftedBy(receiveToken.decimals)
    .toFixed(0)

  const minExpectedReceiveAmount = new BigNumber(expectedReceiveAmount)
    .times(1 - slippage / 100)
    .toFixed(0)

  return { expectedReceiveAmount, minExpectedReceiveAmount }
}
