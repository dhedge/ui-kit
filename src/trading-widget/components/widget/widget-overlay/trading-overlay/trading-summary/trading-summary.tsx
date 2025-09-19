import type { FC } from 'react'

import { useTradingPanelModal } from 'core-kit/hooks/state'
import { ApproveSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/approve-summary'
import { SwapSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/swap-summary'
import { VaultTransactionSummary } from 'trading-widget/components/widget/widget-overlay/trading-overlay/trading-summary/vault-transaction-summary'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const TradingSummary: FC = () => {
  const t = useTranslationContext()
  const [{ action, receiveTokens, sendTokens }] = useTradingPanelModal()

  if (action === 'approve') {
    return <ApproveSummary sendTokens={sendTokens} />
  }

  if (action === 'swap') {
    return <SwapSummary receiveTokens={receiveTokens} />
  }

  if (action === 'claim') {
    return <>{t.claimLabel}</>
  }

  if (action === 'create_limit_sell_order') {
    return <>{t.createLimitSellOrder}</>
  }

  if (action === 'delete_limit_order_withdraw') {
    return <>{t.deleteWithdrawalRequest}</>
  }

  if (action === 'limit_order_withdraw') {
    return <>{t.withdrawalRequest}</>
  }

  return (
    <VaultTransactionSummary
      action={action}
      sendTokens={sendTokens}
      receiveTokens={receiveTokens}
    />
  )
}
