import BigNumber from 'bignumber.js'

import { usePoolFees, usePoolManagerLogicData } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelLockTime,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useDepositProjectedEarnings } from 'core-kit/hooks/trading'
import { formatToUsd } from 'core-kit/utils'

import {
  useGetSlippagePlaceholder,
  useGetThemeTypeBySlippage,
} from 'trading-widget/hooks'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const useDepositTransactionDisclosure = () => {
  const t = useTranslationContext()
  const { customLockTime } = useConfigContextParams()
  const [approvingStatus] = useTradingPanelApprovingStatus()
  const [{ slippage, minSlippage, isInfiniteAllowance, isMaxSlippageLoading }] =
    useTradingPanelSettings()
  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()
  const { address, chainId } = useTradingPanelPoolConfig()

  const { entryFee, hasPoolEntryFee } = usePoolFees({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const projectedEarnings = useDepositProjectedEarnings()
  const lockTime = useTradingPanelLockTime()

  const minDeposit = minDepositUSD
    ? formatToUsd({ value: minDepositUSD, minimumFractionDigits: 0 })
    : ''

  const isAutoSlippage = slippage === 'auto'

  const themeType = useGetThemeTypeBySlippage(
    isAutoSlippage ? minSlippage ?? 0 : slippage,
  )

  const slippagePlaceholder = useGetSlippagePlaceholder(
    'deposit',
    slippage,
    minSlippage,
  )
  const slippageTooltipText =
    themeType === THEME_TYPE.DEFAULT
      ? t.depositSlippageWarning
      : t.highSlippageWarning

  const getMinReceiveText = () => {
    if (isAutoSlippage) {
      return `${new BigNumber(receiveToken.value || 0).toFixed(
        4,
      )} ${receiveToken.symbol.toUpperCase()}`
    }
    if (receiveToken.symbol === 'all') {
      return t.estimatedMultiAssetFractions
    }

    const receiveBalance = new BigNumber(receiveToken.value ?? 0)
    const receiveValueAfterSlippage =
      receiveToken.value && receiveBalance.isFinite()
        ? receiveBalance.times(1 - slippage / 100).toFixed(4)
        : '0'

    return `${receiveValueAfterSlippage} ${receiveToken.symbol.toUpperCase()}`
  }

  const tokenAllowance = isInfiniteAllowance
    ? t.infinite
    : `${new BigNumber(sendToken.value || '0').toFixed(4)} ${sendToken.symbol}`

  const entryFeeTooltipText = hasPoolEntryFee
    ? t.entryFeeExplanation
    : t.easySwapperEntryFee.replace('{time}', customLockTime)

  return {
    projectedEarnings,
    themeType,
    slippageTooltipText,
    isMaxSlippageLoading,
    slippagePlaceholder,
    minReceive: getMinReceiveText(),
    allowanceRequired: !approvingStatus,
    tokenAllowance,
    sendTokenSymbol: sendToken.symbol,
    entryFee,
    entryFeeTooltipText,
    minDeposit,
    lockTime,
  }
}
