import type { FC } from 'react'

import { ReloadButton } from 'trading-widget/components/common/button/reload-button/reload-button'
import { useReloadWithdrawSwapQuoteButton } from 'trading-widget/components/widget/widget-buttons/reload-swap-quote-button/reload-withdraw-swap-quote-button/reload-withdraw-swap-quote-button.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const ReloadWithdrawSwapQuoteButton: FC = () => {
  const t = useTranslationContext()
  const { refetch, showButton, disabled } = useReloadWithdrawSwapQuoteButton()
  if (!showButton) {
    return null
  }

  return (
    <ReloadButton
      tooltipText={t.refreshSwapQuoteTooltip}
      onClick={refetch}
      disabled={disabled}
    />
  )
}
