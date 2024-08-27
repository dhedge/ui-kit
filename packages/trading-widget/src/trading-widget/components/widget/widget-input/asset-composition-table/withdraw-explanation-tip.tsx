import type { FC } from 'react'

import { TokenIcon } from 'trading-widget/components/common'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const WithdrawExplanationTip: FC<{ symbol: string }> = ({ symbol }) => {
  const t = useTranslationContext()

  return (
    <div className="dtw-flex dtw-gap-1 dtw-items-center dtw-text-xs dtw-text-[color:var(--panel-secondary-content-color)]">
      {t.as} <TokenIcon symbols={[symbol]} size="xs" /> {symbol}
    </div>
  )
}
