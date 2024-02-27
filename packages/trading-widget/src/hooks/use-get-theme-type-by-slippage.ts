import { useConfigContextParams } from 'providers/config-provider'
import type { ThemeType } from 'types'
import { THEME_TYPE } from 'types'

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
