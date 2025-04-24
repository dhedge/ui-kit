import BigNumber from 'bignumber.js'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { usePoolFees, usePoolManagerLogicData } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
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
  const [{ slippage, minSlippage, isMaxSlippageLoading }] =
    useTradingPanelSettings()
  const isAutoSlippage = slippage === 'auto'
  const minReceivedVaultTokensAmount = useMinVaultTokensReceivedAmount()

  const [receiveToken] = useReceiveTokenInput()
  const { address, chainId } = useTradingPanelPoolConfig()

  const { entryFee } = usePoolFees({ address })
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
    entryFee,
    entryFeeTooltipText: t.entryFeeExplanation,
    minDeposit,
    lockTime,
    showMinimumReceivedAmount,
  }
}
