import type { FC } from 'react'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

interface MaxBalanceButtonProps {
  onClick: () => void
}

export const MaxBalanceButton: FC<MaxBalanceButtonProps> = ({ onClick }) => {
  const t = useTranslationContext()
  return (
    <button
      className="dtw-cursor-pointer dtw-text-[color:var(--panel-input-button-content-color,var(--panel-content-color))] dtw-rounded-[var(--panel-input-button-radius,var(--panel-radius))] dtw-bg-[var(--panel-input-button-bg,var(--panel-secondary-color))] dtw-border dtw-border-[var(--panel-input-button-border-color,var(--panel-accent-to-color))] dtw-px-[var(--panel-input-button-px)] dtw-text-[length:var(--panel-input-button-font-size,var(--panel-font-size-xs))] dtw-leading-[var(--panel-input-button-line-height,var(--panel-line-height-xs))] hover:dtw-opacity-[var(--panel-action-hover-opacity)] dtw-opacity-[var(--panel-action-opacity)]"
      onClick={onClick}
    >
      {t.max}
    </button>
  )
}
