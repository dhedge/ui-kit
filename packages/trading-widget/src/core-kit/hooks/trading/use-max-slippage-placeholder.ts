import isNumber from 'lodash.isnumber'

import {
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
} from 'core-kit/const'
import {
  useTradingPanelSettings,
  useTradingPanelType,
} from 'core-kit/hooks/state'

export const useMaxSlippagePlaceholder = () => {
  const [tradingType] = useTradingPanelType()
  const [{ slippage, minSlippage }] = useTradingPanelSettings()

  if (slippage !== 'auto') {
    return slippage.toString()
  }

  if (isNumber(minSlippage)) {
    return minSlippage.toString()
  }

  return tradingType === 'deposit'
    ? DEFAULT_DEPOSIT_SLIPPAGE.toString()
    : `auto ${DEFAULT_WITHDRAW_SLIPPAGE_SCALE[0]}-${
        DEFAULT_WITHDRAW_SLIPPAGE_SCALE[
          DEFAULT_WITHDRAW_SLIPPAGE_SCALE.length - 1
        ]
      }`
}
