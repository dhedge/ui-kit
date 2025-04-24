import type { FC, PropsWithChildren } from 'react'

import { commify } from 'core-kit/utils'

import {
  ActionButton,
  DisabledButtonWithPrompt,
} from 'trading-widget/components/common'
import { ApproveButton } from 'trading-widget/components/widget/widget-buttons'

import { useTradingTypeName } from 'trading-widget/hooks'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useValidDepositButton } from './valid-deposit-button.hooks'

export const ValidDepositButton: FC<PropsWithChildren> = ({ children }) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const t = useTranslationContext()
  const name = useTradingTypeName('deposit')

  const {
    requiresMinDeposit,
    minDepositUSD,
    requiresApprove,
    requiresWhitelist,
    requiresHighSlippageConfirm,
    deprecated = false,
    poolSymbol,
    sendTokenSymbol,
    slippageToBeUsed,
    approve,
    confirmHighSlippage,
    maintenance,
  } = useValidDepositButton()

  if (requiresMinDeposit) {
    return (
      <Button disabled>
        {t.minimumPurchase.replace(
          '{value}',
          commify(minDepositUSD.toString() ?? ''),
        )}
      </Button>
    )
  }

  if (requiresWhitelist || maintenance) {
    return (
      <DisabledButtonWithPrompt
        promptText={
          deprecated
            ? t.poolIsInactive.replace('{poolSymbol}', poolSymbol)
            : maintenance
              ? t.poolDepositsAreMaintenance.replace('{poolSymbol}', poolSymbol)
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

  if (requiresHighSlippageConfirm) {
    return (
      <Button onClick={confirmHighSlippage}>
        {t.confirmMaxSlippage.replace(
          '{slippagePercentage}',
          `${Math.abs(slippageToBeUsed)}`,
        )}
      </Button>
    )
  }

  return children
}
