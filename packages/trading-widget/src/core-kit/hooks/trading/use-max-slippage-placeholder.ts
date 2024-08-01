import isNumber from 'lodash.isnumber'

import { DEFAULT_DEPOSIT_SLIPPAGE } from 'core-kit/const'
import {
  useTradingPanelSettings,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useMaxSlippagePlaceholder = () => {
  const [tradingType] = useTradingPanelType()
  const [{ slippage, minSlippage }] = useTradingPanelSettings()
  const { defaultWithdrawSlippageScale } = useConfigContextParams()

  if (slippage !== 'auto') {
    return slippage.toString()
  }

  if (isNumber(minSlippage)) {
    return minSlippage.toString()
  }

  return tradingType === 'deposit'
    ? DEFAULT_DEPOSIT_SLIPPAGE.toString()
    : `auto ${defaultWithdrawSlippageScale[0]}-${
        defaultWithdrawSlippageScale[defaultWithdrawSlippageScale.length - 1]
      }`
}
