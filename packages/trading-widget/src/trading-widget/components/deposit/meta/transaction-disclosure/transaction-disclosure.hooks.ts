import BigNumber from 'bignumber.js'

import { CUSTOM_LOCK_TIME } from 'core-kit/const'
import {
  usePoolFees,
  usePoolManagerLogicData,
  usePoolTokenPrice,
} from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelLockTime,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import {
  useAssetPrice,
  useDepositProjectedEarnings,
} from 'core-kit/hooks/trading'
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
  const { chainCustomLockTimeMap } = useConfigContextParams()
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

  const { entryFee, hasPoolEntryFee } = usePoolFees({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const projectedEarnings = useDepositProjectedEarnings()
  const lockTime = useTradingPanelLockTime()

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
  const customLockTime = chainCustomLockTimeMap[chainId] ?? CUSTOM_LOCK_TIME

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
