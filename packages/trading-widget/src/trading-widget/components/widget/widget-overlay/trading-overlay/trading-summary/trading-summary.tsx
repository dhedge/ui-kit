import type { FC } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import { ApproveSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/approve-summary'
import { OraclesUpdateSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/oracles-update-summary'
import { SwapSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/swap-summary'
import { VaultTransactionSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/vault-transaction-summary'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const TradingSummary: FC = () => {
  const t = useTranslationContext()
  const [{ action, receiveTokens, sendTokens, status }] = useTradingPanelModal()

  if (action === 'oraclesUpdate') {
    return <OraclesUpdateSummary />
  }

  if (action === 'approve') {
    return <ApproveSummary sendTokens={sendTokens} />
  }

  if (action === 'swap') {
    return <SwapSummary receiveTokens={receiveTokens} />
  }

  if (action === 'claim') {
    return <>{t.claimLabel}</>
  }

  return (
    <VaultTransactionSummary
      action={action}
      sendTokens={sendTokens}
      receiveTokens={receiveTokens}
      status={status}
    />
  )
}
