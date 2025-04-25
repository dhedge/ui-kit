import { usePoolFees } from 'core-kit/hooks/pool'
import {
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { formatPercentage } from 'core-kit/utils'
import { useGetThemeTypeBySlippage } from 'trading-widget/hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const useInitWithdrawTransactionDisclosure = () => {
  const t = useTranslationContext()
  const { address } = useTradingPanelPoolConfig()
  const [{ isMaxSlippageLoading }] = useTradingPanelSettings()
  const { exitFeeNumber, withdrawalFeeNumber } = usePoolFees({
    address,
  })
  const slippage = useAppliedWithdrawSlippage()
  const showMinReceivedText = useIsMultiAssetWithdraw()

  const themeType = useGetThemeTypeBySlippage(slippage)

  const slippageTooltipText =
    themeType === THEME_TYPE.DEFAULT
      ? t.withdrawSlippageWarning
      : t.highSlippageWarning

  return {
    slippageTooltipText,
    isMaxSlippageLoading,
    slippagePlaceholder: `${slippage}%`,
    exitFee: formatPercentage(exitFeeNumber + withdrawalFeeNumber, 2),
    minReceivedText: t.estimatedMultiAssetFractions,
    showMinReceivedText,
    withdrawalFee: withdrawalFeeNumber
      ? `*${withdrawalFeeNumber}% fee will go back to the vault holders`
      : null,
  }
}
