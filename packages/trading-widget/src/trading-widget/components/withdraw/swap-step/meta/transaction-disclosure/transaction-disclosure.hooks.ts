import { DEFAULT_WITHDRAW_SLIPPAGE } from 'core-kit/const'
import { useTradingPanelSettings } from 'core-kit/hooks/state'

import { useGetThemeTypeBySlippage } from 'trading-widget/hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const useWithdrawSwapTransactionDisclosure = () => {
  const t = useTranslationContext()
  const [{ slippage }] = useTradingPanelSettings()

  const withdrawSlippage =
    slippage === 'auto' ? DEFAULT_WITHDRAW_SLIPPAGE : slippage

  const themeType = useGetThemeTypeBySlippage(withdrawSlippage)

  const slippageTooltipText =
    themeType === THEME_TYPE.DEFAULT
      ? t.withdrawSlippageWarning
      : t.highSlippageWarning

  // const getMinReceiveText = () => {
  //   if (receiveToken.symbol === 'all') {
  //     return t.estimatedMultiAssetFractions
  //   }
  //
  //   const receiveBalance = new BigNumber(receiveToken.value ?? 0)
  //   const isAutoSlippageWithMinValue = isAutoSlippage && isMinSlippageNumber
  //   const slippageValue = isAutoSlippage
  //     ? defaultWithdrawSlippageScale[defaultWithdrawSlippageScale.length - 1]
  //     : isAutoSlippageWithMinValue
  //       ? minSlippage
  //       : slippage
  //   const receiveValueAfterSlippage =
  //     receiveToken.value && receiveBalance.isFinite() && slippageValue
  //       ? receiveBalance.times(1 - slippageValue / 100).toFixed(4)
  //       : '0'
  //
  //   return `${receiveValueAfterSlippage} ${receiveToken.symbol.toUpperCase()}`
  // }

  return {
    themeType,
    slippageTooltipText,
    slippagePlaceholder: withdrawSlippage.toString(),
  }
}
