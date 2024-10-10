import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useWithdrawSlippage } from 'core-kit/hooks/trading/withdraw'
import { useExpectedReceiveSwapAmount } from 'core-kit/hooks/trading/withdraw/swap-step'
import { formatNumberToLimitedDecimals, formatUnits } from 'core-kit/utils'
import { useGetThemeTypeBySlippage } from 'trading-widget/hooks'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const useWithdrawSwapTransactionDisclosure = () => {
  const t = useTranslationContext()
  const { stablePrecision } = useConfigContextParams()

  const [receiveToken] = useReceiveTokenInput()

  const withdrawSlippage = useWithdrawSlippage()
  const { minExpectedReceiveAmount } = useExpectedReceiveSwapAmount()

  const themeType = useGetThemeTypeBySlippage(withdrawSlippage)

  const slippageTooltipText =
    themeType === THEME_TYPE.DEFAULT
      ? t.withdrawSlippageWarning
      : t.highSlippageWarning

  return {
    themeType,
    slippageTooltipText,
    slippagePlaceholder: withdrawSlippage.toString(),
    minReceive: `${formatNumberToLimitedDecimals(
      formatUnits(BigInt(minExpectedReceiveAmount), receiveToken.decimals),
      stablePrecision,
    )} ${receiveToken.symbol}`,
  }
}
