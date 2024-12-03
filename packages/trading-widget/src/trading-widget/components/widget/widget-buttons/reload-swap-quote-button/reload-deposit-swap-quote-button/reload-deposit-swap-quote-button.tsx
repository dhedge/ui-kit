import type { FC } from 'react'

import { ReloadButton } from 'trading-widget/components/common/button/reload-button/reload-button'
import { useReloadDepositSwapQuoteButton } from 'trading-widget/components/widget/widget-buttons/reload-swap-quote-button/reload-deposit-swap-quote-button/reload-deposit-swap-quote-button.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const ReloadDepositSwapQuoteButton: FC = () => {
  const t = useTranslationContext()
  const { showButton, handleSwapQuoteReload, disabled } =
    useReloadDepositSwapQuoteButton()

  if (!showButton) {
    return null
  }

  return (
    <ReloadButton
      tooltipText={t.refreshSwapQuoteTooltip}
      onClick={handleSwapQuoteReload}
      disabled={disabled}
    />
  )
}
