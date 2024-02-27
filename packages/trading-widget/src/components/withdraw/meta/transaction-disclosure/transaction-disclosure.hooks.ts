import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelSettings,
} from '@dhedge/core-ui-kit/hooks/state'
import BigNumber from 'bignumber.js'

import isNumber from 'lodash.isnumber'

import { useGetSlippagePlaceholder, useGetThemeTypeBySlippage } from 'hooks'
import { useConfigContextParams } from 'providers/config-provider'
import { useTranslationContext } from 'providers/translation-provider'

import { THEME_TYPE } from 'types'

export const useWithdrawTransactionDisclosure = () => {
  const t = useTranslationContext()
  const { defaultWithdrawSlippageScale } = useConfigContextParams()
  const [approvingStatus] = useTradingPanelApprovingStatus()
  const [
    { slippage, minSlippage, isInfiniteAllowance, isMaxSlippageLoading },
    updateSettings,
  ] = useTradingPanelSettings()
  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()

  const isAutoSlippage = slippage === 'auto'
  const isMinSlippageNumber = isNumber(minSlippage)

  const themeType = useGetThemeTypeBySlippage(
    isAutoSlippage ? minSlippage ?? 0 : slippage,
  )

  const slippagePlaceholder = useGetSlippagePlaceholder(
    'withdraw',
    slippage,
    minSlippage,
  )
  const slippageTooltipText =
    themeType === THEME_TYPE.DEFAULT ? t.slippageWarning : t.highSlippageWarning

  const getMinReceiveText = () => {
    if (receiveToken.symbol === 'all') {
      return t.estimatedMultiAssetFractions
    }

    const receiveBalance = new BigNumber(receiveToken.value ?? 0)
    const isAutoSlippageWithMinValue = isAutoSlippage && isMinSlippageNumber
    const slippageValue = isAutoSlippage
      ? defaultWithdrawSlippageScale[defaultWithdrawSlippageScale.length - 1]
      : isAutoSlippageWithMinValue
        ? minSlippage
        : slippage
    const receiveValueAfterSlippage =
      receiveToken.value && receiveBalance.isFinite() && slippageValue
        ? receiveBalance.times(1 - slippageValue / 100).toFixed(4)
        : '0'

    return `${receiveValueAfterSlippage} ${receiveToken.symbol.toUpperCase()}`
  }

  const handleMinTradingSlippage = () => {
    if (isMinSlippageNumber) {
      updateSettings({ slippage: minSlippage })
    }
  }

  const tokenAllowance = isInfiniteAllowance
    ? t.infinite
    : `${new BigNumber(sendToken.value || '0').toFixed(4)} ${sendToken.symbol}`

  const showApplyMinSlippageButton =
    isMinSlippageNumber && minSlippage !== slippage

  return {
    themeType,
    slippageTooltipText,
    isMaxSlippageLoading,
    slippagePlaceholder,
    minReceive: getMinReceiveText(),
    allowanceRequired: !approvingStatus,
    tokenAllowance,
    sendTokenSymbol: sendToken.symbol,
    isAutoSlippage,
    minSlippage,
    showApplyMinSlippageButton,
    handleMinTradingSlippage,
  }
}
