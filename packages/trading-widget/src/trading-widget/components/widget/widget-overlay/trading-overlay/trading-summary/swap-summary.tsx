import type { FC } from 'react'

import type { TradingPanelStateModal } from 'core-kit/types'
import { TokenIcon } from 'trading-widget/components/common'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface SwapSummaryProps {
  receiveTokens: TradingPanelStateModal['receiveTokens']
}

export const SwapSummary: FC<SwapSummaryProps> = ({ receiveTokens }) => {
  const t = useTranslationContext()
  const [receiveToken] = receiveTokens ?? []
  if (!receiveToken) {
    return null
  }

  return (
    <div className="dtw-flex dtw-flex-wrap dtw-items-center dtw-justify-center dtw-gap-1">
      {t.swapAndClaimTo}{' '}
      <div className="dtw-flex dtw-items-center dtw-gap-1">
        <TokenIcon size="sm" symbols={[receiveToken.symbol]} />{' '}
        {receiveToken.symbol}
      </div>
    </div>
  )
}
