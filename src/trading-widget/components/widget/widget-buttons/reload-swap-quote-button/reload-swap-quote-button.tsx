import type { FC } from 'react'

import { useIsDepositTradingPanelType } from 'core-kit/hooks/state'
import { ReloadDepositSwapQuoteButton } from 'trading-widget/components/widget/widget-buttons/reload-swap-quote-button/reload-deposit-swap-quote-button/reload-deposit-swap-quote-button'
import { ReloadWithdrawSwapQuoteButton } from 'trading-widget/components/widget/widget-buttons/reload-swap-quote-button/reload-withdraw-swap-quote-button/reload-withdraw-swap-quote-button'

export const ReloadSwapQuoteButton: FC = () => {
  const isDeposit = useIsDepositTradingPanelType()

  return isDeposit ? (
    <ReloadDepositSwapQuoteButton />
  ) : (
    <ReloadWithdrawSwapQuoteButton />
  )
}
