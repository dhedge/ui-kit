import type { FC, PropsWithChildren } from 'react'

import {
  ActionButton,
  DisabledButtonWithPrompt,
} from 'trading-widget/components/common'
import { ApproveButton } from 'trading-widget/components/widget/widget-buttons'

import { useValidWithdrawButton } from 'trading-widget/components/withdraw/unroll-step/button/valid-withdraw-button/valid-withdraw-button.hooks'
import { useTradingTypeName } from 'trading-widget/hooks'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const ValidWithdrawButton: FC<PropsWithChildren> = ({ children }) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const t = useTranslationContext()
  const name = useTradingTypeName('withdraw')
  const {
    requiresWithdrawalWindow,
    requiresWithdrawalLiquidity,
    requiresEndOfCooldown,
    requiresApprove,
    requiresHighSlippageConfirm,
    requiresUpdate,
    sendTokenSymbol,
    slippageToBeUsed,
    cooldownEndsInTime,
    withdrawalWindowStartTime,
    withdrawalLiquidity,
    withdrawalLiquiditySymbol = '',
    approve,
    updateOracles,
    isCheckOraclesPending,
    handleHighSlippageClick,
  } = useValidWithdrawButton()

  if (requiresWithdrawalWindow) {
    return (
      <DisabledButtonWithPrompt
        promptText={t.withdrawalWindowDisabled
          .replace('{tokenSymbol}', sendTokenSymbol)
          .replace('{startTime}', withdrawalWindowStartTime)}
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (requiresWithdrawalLiquidity) {
    return (
      <DisabledButtonWithPrompt
        promptText={t.withdrawalLiquidityDisabled
          .replace('{value}', withdrawalLiquidity)
          .replace('{symbol}', withdrawalLiquiditySymbol)}
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (requiresEndOfCooldown) {
    return (
      <DisabledButtonWithPrompt
        promptText={t.withdrawCooldown
          .replace('{tokenSymbol}', sendTokenSymbol)
          .replace('{cooldownEndTime}', cooldownEndsInTime)}
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (requiresApprove) {
    return <ApproveButton onApprove={approve} symbol={sendTokenSymbol} />
  }

  if (requiresHighSlippageConfirm) {
    return (
      <Button onClick={handleHighSlippageClick}>
        {t.confirmMaxSlippage.replace(
          '{slippagePercentage}',
          `${Math.abs(slippageToBeUsed)}`,
        )}
      </Button>
    )
  }

  if (requiresUpdate || isCheckOraclesPending) {
    return (
      <Button onClick={updateOracles} loading={isCheckOraclesPending}>
        {isCheckOraclesPending ? t.checkingOracles : t.updateOracles}
      </Button>
    )
  }

  return children
}
