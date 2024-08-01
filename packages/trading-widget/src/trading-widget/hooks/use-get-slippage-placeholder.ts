import isNumber from 'lodash.isnumber'

import {
  DEFAULT_DEPOSIT_SLIPPAGE,
  DEFAULT_WITHDRAW_SLIPPAGE,
} from 'core-kit/const'
import type { TradingPanelType } from 'core-kit/types'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useGetSlippagePlaceholder = ({
  tradingType,
  slippage,
  minSlippage,
  showDefaultSlippage,
}: {
  tradingType: TradingPanelType
  slippage: number | 'auto'
  minSlippage?: number
  showDefaultSlippage?: boolean
}) => {
  const { defaultWithdrawSlippageScale } = useConfigContextParams()

  if (showDefaultSlippage && slippage === 'auto') {
    return tradingType === 'deposit'
      ? DEFAULT_DEPOSIT_SLIPPAGE.toString()
      : DEFAULT_WITHDRAW_SLIPPAGE.toString()
  }

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
