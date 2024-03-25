import { commify } from 'core-kit/utils'
import type { FC, PropsWithChildren } from 'react'

import { ActionButton, DisabledButtonWithPrompt } from 'trading-widget/components/common'
import { ApproveButton } from 'trading-widget/components/widget/widget-buttons'

import { useTradingTypeName } from 'trading-widget/hooks'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useValidDepositButton } from './valid-deposit-button.hooks'

export const ValidDepositButton: FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslationContext()
  const name = useTradingTypeName('deposit')

  const {
    requiresMinDeposit,
    minDepositUSD,
    requiresApprove,
    requiresWhitelist,
    requiresUpdate,
    requiresHighSlippageConfirm,
    deprecated = false,
    poolSymbol,
    sendTokenSymbol,
    slippageToBeUsed,
    updateOracles,
    approve,
    confirmHighSlippage,
  } = useValidDepositButton()

  if (requiresMinDeposit) {
    return (
      <ActionButton disabled>
        {t.minimumPurchase.replace(
          '{value}',
          commify(minDepositUSD.toString() ?? ''),
        )}
      </ActionButton>
    )
  }

  if (requiresWhitelist) {
    return (
      <DisabledButtonWithPrompt
        promptText={
          deprecated
            ? t.poolIsInactive.replace('{poolSymbol}', poolSymbol)
            : t.poolIsPrivate
        }
      >
        {name}
      </DisabledButtonWithPrompt>
    )
  }

  if (requiresApprove) {
    return <ApproveButton symbol={sendTokenSymbol} onApprove={approve} />
  }

  if (requiresUpdate) {
    return (
      <ActionButton onClick={updateOracles}>{t.updateOracles}</ActionButton>
    )
  }

  if (requiresHighSlippageConfirm) {
    return (
      <ActionButton onClick={confirmHighSlippage}>
        {t.confirmMaxSlippage.replace(
          '{slippagePercentage}',
          `${Math.abs(slippageToBeUsed)}`,
        )}
      </ActionButton>
    )
  }

  return children
}
