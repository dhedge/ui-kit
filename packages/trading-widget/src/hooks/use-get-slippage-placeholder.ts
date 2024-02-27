import type { TradingPanelType } from '@dhedge/core-ui-kit/types'
import isNumber from 'lodash.isnumber'

import { useConfigContextParams } from 'providers/config-provider'

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
