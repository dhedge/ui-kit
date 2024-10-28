import BigNumber from 'bignumber.js'

import { usePoolFees } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2'
import { useIsMultiAssetWithdraw } from 'core-kit/hooks/trading/withdraw-v2/init-step'
import { useGetThemeTypeBySlippage } from 'trading-widget/hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const useInitWithdrawTransactionDisclosure = () => {
  const t = useTranslationContext()
  const { address, chainId } = useTradingPanelPoolConfig()
  const [approvingStatus] = useTradingPanelApprovingStatus()
  const [{ isInfiniteAllowance, isMaxSlippageLoading }] =
    useTradingPanelSettings()
  const [sendToken] = useSendTokenInput()
  const { exitFee } = usePoolFees({ address, chainId })
  const slippage = useAppliedWithdrawSlippage()
  const showMinReceivedText = useIsMultiAssetWithdraw()

  const themeType = useGetThemeTypeBySlippage(slippage)

  const slippageTooltipText =
    themeType === THEME_TYPE.DEFAULT
      ? t.withdrawSlippageWarning
      : t.highSlippageWarning

  const tokenAllowance = isInfiniteAllowance
    ? t.infinite
    : `${new BigNumber(sendToken.value || '0').toFixed(4)} ${sendToken.symbol}`

  return {
    slippageTooltipText,
    isMaxSlippageLoading,
    slippagePlaceholder: `${slippage}%`,
    allowanceRequired: !approvingStatus,
    tokenAllowance,
    sendTokenSymbol: sendToken.symbol,
    exitFee,
    minReceivedText: t.estimatedMultiAssetFractions,
    showMinReceivedText,
  }
}
