import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import type { ThemeType } from 'trading-widget/types'
import { THEME_TYPE } from 'trading-widget/types'

export const useGetThemeTypeBySlippage = (slippage: number): ThemeType => {
  const { depositQuoteDiffErrorThreshold, depositQuoteDiffWarningThreshold } =
    useConfigContextParams()

  const value = Math.abs(slippage)

  if (value > depositQuoteDiffErrorThreshold) {
    return THEME_TYPE.ERROR
  }

  if (value > depositQuoteDiffWarningThreshold) {
    return THEME_TYPE.WARNING
  }

  return THEME_TYPE.DEFAULT
}
