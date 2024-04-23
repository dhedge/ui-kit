import isNumber from 'lodash.isnumber'

import {
  useTradingPanelSettings,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useMaxSlippagePlaceholder = () => {
  const [tradingType] = useTradingPanelType()
  const [{ slippage, minSlippage }] = useTradingPanelSettings()
  const { defaultWithdrawSlippageScale, defaultDepositSlippage } =
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
