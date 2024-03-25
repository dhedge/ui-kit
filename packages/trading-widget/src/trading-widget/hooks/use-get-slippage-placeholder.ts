import isNumber from 'lodash.isnumber'

import type { TradingPanelType } from 'core-kit/types'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useGetSlippagePlaceholder = (
  tradingType: TradingPanelType,
  slippage: number | 'auto',
  minSlippage?: number,
) => {
  const { defaultDepositSlippage, defaultWithdrawSlippageScale } =
    useConfigContextParams()

  if (slippage !== 'auto') {
    return slippage.toString()
  }

  if (isNumber(minSlippage)) {
    return minSlippage.toString()
  }

  return tradingType === 'deposit'
    ? defaultDepositSlippage.toString()
    : `auto ${defaultWithdrawSlippageScale[0]}-${
        defaultWithdrawSlippageScale[defaultWithdrawSlippageScale.length - 1]
      }`
}
