import type { FC, PropsWithChildren } from 'react'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const Balance: FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslationContext()
  return (
    <div className="dtw-px-[var(--panel-balance-group-px)] dtw-flex-col dtw-gap-[var(--panel-balance-group-gap,var(--panel-gap))]">
      <div className="dtw-text-[length:var(--panel-label-font-size,var(--panel-font-size-xs))] dtw-leading-[var(--panel-label-line-height,var(--panel-line-height-xs))] dtw-text-[color:var(--panel-secondary-content-color)]">
        {t.yourBalance}
      </div>
      {children}
    </div>
  )
}
