import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useExpectedReceiveSwapAmount } from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { formatNumberToLimitedDecimals, formatUnits } from 'core-kit/utils'
import { useGetThemeTypeBySlippage } from 'trading-widget/hooks'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const useWithdrawSwapTransactionDisclosure = () => {
  const t = useTranslationContext()
  const { stablePrecision } = useConfigContextParams()

  const [receiveToken] = useReceiveTokenInput()

  const withdrawSlippage = useAppliedWithdrawSlippage()
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
