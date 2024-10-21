import type { FC } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import { ApproveSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/approve-summary'
import { ClaimSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/claim-summary'
import { OraclesUpdateSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/oracles-update-summary'
import { SwapSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/swap-summary'
import { VaultTransactionSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/vault-transaction-summary'

export const TradingSummary: FC = () => {
  const [{ action, receiveTokens, sendTokens }] = useTradingPanelModal()

  if (action === 'oraclesUpdate') {
    return <OraclesUpdateSummary />
  }

  if (action === 'approve') {
    return <ApproveSummary sendTokens={sendTokens} />
  }

  if (action === 'swap') {
    return <SwapSummary sendTokens={sendTokens} receiveTokens={receiveTokens} />
  }

  if (action === 'claim') {
    return <ClaimSummary receiveTokens={receiveTokens} />
  }

  return (
    <VaultTransactionSummary
      action={action}
      sendTokens={sendTokens}
      receiveTokens={receiveTokens}
    />
  )
}
