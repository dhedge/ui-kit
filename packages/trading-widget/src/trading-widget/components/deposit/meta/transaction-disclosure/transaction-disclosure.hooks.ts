import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolFees, usePoolManagerLogicData } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelApprovingStatus,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useDepositProjectedEarnings } from 'core-kit/hooks/trading'
import {
  useDepositLockTime,
  useIsDepositWithSwapTransaction,
  useMinVaultTokensReceivedAmount,
} from 'core-kit/hooks/trading/deposit-v2'
import { formatNumberToLimitedDecimals, formatToUsd } from 'core-kit/utils'

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
  const minReceivedVaultTokensAmount = useMinVaultTokensReceivedAmount()

  const [receiveToken] = useReceiveTokenInput()
  const [sendToken] = useSendTokenInput()
  const { address, chainId } = useTradingPanelPoolConfig()

  const { entryFee } = usePoolFees({ address, chainId })
  const { minDepositUSD } = usePoolManagerLogicData(address, chainId)
  const projectedEarnings = useDepositProjectedEarnings()
  const lockTime = useDepositLockTime()
  const showMinimumReceivedAmount = useIsDepositWithSwapTransaction()

  const minDeposit = minDepositUSD
    ? formatToUsd({ value: minDepositUSD, minimumFractionDigits: 0 })
    : ''

  const themeType = useGetThemeTypeBySlippage(
    isAutoSlippage ? (minSlippage ?? 0) : slippage,
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

  const tokenAllowance = isInfiniteAllowance
    ? t.infinite
    : `${new BigNumber(sendToken.value || '0').toFixed(4)} ${sendToken.symbol}`

  const minReceivedVaultTokens = formatNumberToLimitedDecimals(
    new BigNumber(minReceivedVaultTokensAmount)
      .shiftedBy(-DEFAULT_PRECISION)
      .toFixed(),
    4,
  )

  return {
    projectedEarnings,
    themeType,
    slippageTooltipText,
    isMaxSlippageLoading,
    slippagePlaceholder,
    minReceive: `${minReceivedVaultTokens} ${receiveToken.symbol.toUpperCase()}`,
    allowanceRequired: !approvingStatus,
    tokenAllowance,
    sendTokenSymbol: sendToken.symbol,
    entryFee,
    entryFeeTooltipText: t.entryFeeExplanation,
    minDeposit,
    lockTime,
    showMinimumReceivedAmount,
  }
}
