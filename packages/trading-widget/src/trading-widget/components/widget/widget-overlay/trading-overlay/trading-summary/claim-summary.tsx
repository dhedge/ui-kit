import type { FC } from 'react'

import type { TradingPanelStateModal } from 'core-kit/types'
import { formatNumberToLimitedDecimals } from 'core-kit/utils'
import { TokenIcon } from 'trading-widget/components/common'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface ClaimSummaryProps {
  receiveTokens: TradingPanelStateModal['receiveTokens']
}

export const ClaimSummary: FC<ClaimSummaryProps> = ({ receiveTokens }) => {
  const t = useTranslationContext()
  const { defaultPrecision } = useConfigContextParams()

  return (
    <div>
      <span>{t.claimLabel}</span>
      <div className="dtw-flex dtw-flex-col dtw-items-start dtw-justify-center dtw-gap-1 dtw-flex-wrap dtw-overflow-y-auto dtw-text-[length:var(--panel-input-label-font-size,var(--panel-font-size-sm))]">
        {receiveTokens?.map(({ address, symbol, value }) => (
          <div key={address} className="dtw-flex dtw-gap-1">
            <TokenIcon symbols={[symbol]} size="sm" /> {symbol}{' '}
            {formatNumberToLimitedDecimals(value, defaultPrecision)}
          </div>
        ))}
      </div>
    </div>
  )
}
