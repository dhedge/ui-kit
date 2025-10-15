import type { FC, PropsWithChildren } from 'react'

import {
  ActionButton,
  DisabledButtonWithPrompt,
} from 'trading-widget/components/common'
import { ApproveButton } from 'trading-widget/components/widget/widget-buttons'

import { LimitOrderWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/limit-order-withdraw-button/limit-order-withdraw-button'
import { useValidInitWithdrawButton } from 'trading-widget/components/withdraw/init-step/button/valid-init-withdraw-button/valid-init-withdraw-button.hooks'
import { useTradingTypeName } from 'trading-widget/hooks'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const ValidInitWithdrawButton: FC<PropsWithChildren> = ({
  children,
}) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const t = useTranslationContext()
  const name = useTradingTypeName('withdraw')
  const {
    requiresEndOfCooldown,
    requiresApprove,
    requiresHighSlippageConfirm,
    sendTokenSymbol,
    slippageToBeUsed,
    dynamicCooldownEndsInTime,
    approve,
    handleHighSlippageClick,
    maintenance,
    poolSymbol,
    isLimitOrderWithdraw,
    insufficientBalance,
  } = useValidInitWithdrawButton()

  if (maintenance) {
    return (
      <DisabledButtonWithPrompt
        promptText={t.poolWithdrawalsAreMaintenance.replace(
          '{poolSymbol}',
          poolSymbol,
        )}
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
          .replace('{cooldownEndTime}', dynamicCooldownEndsInTime)}
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (insufficientBalance) {
    return <Button disabled>{t.insufficientBalance}</Button>
  }

  if (isLimitOrderWithdraw) {
    return <LimitOrderWithdrawButton />
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

  return children
}
