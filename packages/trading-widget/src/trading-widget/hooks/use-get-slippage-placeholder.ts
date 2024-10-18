import isNumber from 'lodash.isnumber'

import { DEFAULT_DEPOSIT_SLIPPAGE } from 'core-kit/const'
import type { TradingPanelType } from 'core-kit/types'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useGetSlippagePlaceholder = ({
  tradingType,
  slippage,
  minSlippage,
}: {
  tradingType: TradingPanelType
  slippage: number | 'auto'
  minSlippage?: number
}) => {
  const { defaultWithdrawSlippage } = useConfigContextParams()

  if (slippage !== 'auto') {
    return slippage.toString()
  }

  if (isNumber(minSlippage)) {
    return minSlippage.toString()
  }

  return tradingType === 'deposit'
    ? DEFAULT_DEPOSIT_SLIPPAGE.toString()
    : defaultWithdrawSlippage.toString()
}
