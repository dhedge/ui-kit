import type { FC, PropsWithChildren } from 'react'

import {
  ActionButton,
  DisabledButtonWithPrompt,
} from 'trading-widget/components/common'
import { ApproveButton } from 'trading-widget/components/widget/widget-buttons'

import { useTradingTypeName } from 'trading-widget/hooks'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useValidWithdrawButton } from './valid-withdraw-button.hooks'

export const ValidWithdrawButton: FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslationContext()
  const name = useTradingTypeName('withdraw')
  const {
    requiresWithdrawalWindow,
    requiresEndOfCooldown,
    requiresApprove,
    requiresHighSlippageConfirm,
    requiresUpdate,
    sendTokenSymbol,
    slippageToBeUsed,
    cooldownEndsInTime,
    withdrawalWindowStartTime,
    approve,
    updateOracles,
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
      <ActionButton onClick={handleHighSlippageClick}>
        {t.confirmMaxSlippage.replace(
          '{slippagePercentage}',
          `${Math.abs(slippageToBeUsed)}`,
        )}
      </ActionButton>
    )
  }

  if (requiresUpdate) {
    return (
      <ActionButton onClick={updateOracles}>{t.updateOracles}</ActionButton>
    )
  }

  return children
}
