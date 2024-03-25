import BigNumber from 'bignumber.js'
import isNumber from 'lodash.isnumber'

import {
  DEFAULT_DEPOSIT_SLIPPAGE_SCALE,
  DEFAULT_WITHDRAW_SLIPPAGE_SCALE,
} from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelSettings,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import type { TradingPanelState, TradingPanelType } from 'core-kit/types'

export const receiveAppliedSlippage = (
  receiveBalance: BigNumber,
  slippage: TradingPanelState['settings']['slippage'],
  tradingType: TradingPanelType,
) => {
  const scale =
    tradingType === 'deposit'
      ? DEFAULT_DEPOSIT_SLIPPAGE_SCALE
      : DEFAULT_WITHDRAW_SLIPPAGE_SCALE
  const slippageValue = slippage === 'auto' ? scale[scale.length - 1] : slippage
  return receiveBalance.isFinite()
    ? receiveBalance.times(1 - (slippageValue ?? 0) / 100).toFixed(4)
    : '0'
}

export const useMinReceiveText = () => {
  const [tradingType] = useTradingPanelType()
  const [receiveToken] = useReceiveTokenInput()
  const [{ slippage, minSlippage }] = useTradingPanelSettings()

  if (tradingType === 'deposit' && slippage === 'auto') {
    return `${new BigNumber(receiveToken.value || 0).toFixed(
      4,
    )} ${receiveToken.symbol.toUpperCase()}`
  }
  if (receiveToken.symbol === 'all') {
    return 'estimated multi asset fractions'
  }
  const isAutoSlippageWithMinValue =
    slippage === 'auto' && isNumber(minSlippage)
  const receiveValueAfterSlippage = receiveToken.value
    ? receiveAppliedSlippage(
        new BigNumber(receiveToken.value || 0),
        isAutoSlippageWithMinValue ? minSlippage : slippage,
        tradingType,
      )
    : '0'

  return `${receiveValueAfterSlippage} ${receiveToken.symbol.toUpperCase()}`
}
