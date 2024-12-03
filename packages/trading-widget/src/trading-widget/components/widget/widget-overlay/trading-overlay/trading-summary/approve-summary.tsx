import type { FC } from 'react'

import type { TradingPanelStateModal } from 'core-kit/types'
import { TokenIcon } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface ApproveSummaryProps {
  sendTokens: TradingPanelStateModal['sendTokens']
}

export const ApproveSummary: FC<ApproveSummaryProps> = ({ sendTokens }) => {
  const t = useTranslationContext()
  const [approvedToken] = sendTokens ?? []

  if (!approvedToken) {
    return null
  }

  return (
    <div className="dtw-flex dtw-items-center dtw-gap-1 dtw-flex-wrap dtw-overflow-hidden">
      <span>{t.approveSpending}</span>
      <TokenIcon size="sm" symbols={[approvedToken.symbol]} />
      <span>{approvedToken.symbol}</span>
    </div>
  )
}
