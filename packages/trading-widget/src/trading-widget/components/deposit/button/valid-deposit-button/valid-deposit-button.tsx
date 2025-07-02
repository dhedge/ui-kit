import type { FC } from 'react'

import {
  ActionButton,
  DisabledButtonWithPrompt,
} from 'trading-widget/components/common'
import { BatchDepositTradeButton } from 'trading-widget/components/deposit/button/batch-trade-button'
import { SingleDepositTradeButton } from 'trading-widget/components/deposit/button/single-trade-button'
import { ApproveButton } from 'trading-widget/components/widget/widget-buttons'

import { useTradingTypeName } from 'trading-widget/hooks'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useValidDepositButton } from './valid-deposit-button.hooks'

export const ValidDepositButton: FC = () => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const t = useTranslationContext()
  const name = useTradingTypeName('deposit')

  const {
    requiresMinDeposit,
    requiredMinDepositAmount,
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
    isBatchContractWritesTrading,
  } = useValidDepositButton()

  if (requiresMinDeposit) {
    return (
      <Button disabled>
        {t.minimumPurchase.replace('{value}', requiredMinDepositAmount)}
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

  if (requiresApprove) {
    return isBatchContractWritesTrading ? (
      <BatchDepositTradeButton />
    ) : (
      <ApproveButton symbol={sendTokenSymbol} onApprove={approve} />
    )
  }

  return <SingleDepositTradeButton />
}
