import BigNumber from 'bignumber.js'

import {
  usePoolFees,
  usePoolManagerLogicData,
  usePoolTokenPrice,
} from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import {
  useAssetPrice,
  useDepositProjectedEarnings,
} from 'core-kit/hooks/trading'
import { useDepositLockTime } from 'core-kit/hooks/trading/deposit-v2'
import { formatToUsd } from 'core-kit/utils'

import {
  useGetSlippagePlaceholder,
  useGetThemeTypeBySlippage,
} from 'trading-widget/hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const useDepositTransactionDisclosure = () => {
  const t = useTranslationContext()
  const [approvingStatus] = useTradingPanelApprovingStatus()
  const [{ slippage, minSlippage, isInfiniteAllowance, isMaxSlippageLoading }] =
    useTradingPanelSettings()
  const isAutoSlippage = slippage === 'auto'

  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()
  const { address, chainId } = useTradingPanelPoolConfig()
  const sendTokenPrice =
    useAssetPrice({
      address: sendToken.address,
      chainId,
      disabled: isAutoSlippage,
    }) ?? ''
  const receiveAssetPrice =
    usePoolTokenPrice({
      address: receiveToken.address,
      chainId,
      disabled: isAutoSlippage,
    }) ?? ''

  const { entryFee } = usePoolFees({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const projectedEarnings = useDepositProjectedEarnings()
  const lockTime = useDepositLockTime()

  const minDeposit = minDepositUSD
    ? formatToUsd({ value: minDepositUSD, minimumFractionDigits: 0 })
    : ''

  const themeType = useGetThemeTypeBySlippage(
    isAutoSlippage ? minSlippage ?? 0 : slippage,
  )
  const slippagePlaceholder = useGetSlippagePlaceholder({
    tradingType: 'deposit',
    slippage,
    minSlippage,
  })
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
    const expectedReceiveTokenAmount = new BigNumber(sendToken.value || '0')
      .multipliedBy(sendTokenPrice)
      .dividedBy(receiveAssetPrice)
    const receiveTokenAmountAfterSlippage =
      expectedReceiveTokenAmount.isFinite()
        ? expectedReceiveTokenAmount.times(1 - slippage / 100).toFixed(4)
        : '0'

    return `${receiveTokenAmountAfterSlippage} ${receiveToken.symbol.toUpperCase()}`
  }

  const tokenAllowance = isInfiniteAllowance
    ? t.infinite
    : `${new BigNumber(sendToken.value || '0').toFixed(4)} ${sendToken.symbol}`

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
    entryFeeTooltipText: t.entryFeeExplanation,
    minDeposit,
    lockTime,
  }
}
