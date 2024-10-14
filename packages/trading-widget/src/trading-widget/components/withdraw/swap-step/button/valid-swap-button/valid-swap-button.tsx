import type { FC, PropsWithChildren } from 'react'

import { ActionButton } from 'trading-widget/components/common'

import { useValidSwapButton } from 'trading-widget/components/withdraw/swap-step/button/valid-swap-button/valid-swap-button.hooks'

import { useComponentContext } from 'trading-widget/providers/component-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const ValidSwapButton: FC<PropsWithChildren> = ({ children }) => {
  const { ActionButton: Button = ActionButton } = useComponentContext()
  const t = useTranslationContext()
  const {
    requiresHighSlippageConfirm,
    slippageToBeUsed,
    handleHighSlippageClick,
  } = useValidSwapButton()

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
