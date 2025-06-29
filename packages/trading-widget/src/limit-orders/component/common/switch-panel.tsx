import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'

import { Switch } from 'trading-widget/components/common'

interface SwitchPanelProps {
  title: string
  subtitle: string
  defaultEnabled: boolean
  onDisable: () => void
}

export const SwitchPanel: FC<PropsWithChildren<SwitchPanelProps>> = ({
  title,
  subtitle,
  defaultEnabled,
  onDisable,
  children,
}) => {
  const [enabled, setEnabled] = useState(defaultEnabled)

  const handleChange = (isEnabled: boolean) => {
    setEnabled(isEnabled)
    if (!isEnabled) {
      onDisable()
    }
  }

  return (
    <div className="dtw-px-3 dtw-py-2 dtw-flex dtw-flex-col dtw-gap-2 dtw-border dtw-border-[var(--limit-order-switch-panel-border-color)] dtw-rounded-[var(--limit-order-switch-panel-radius,var(--limit-order-radius))]">
      <div className="dtw-flex dtw-justify-between dtw-text-[length:var(--limit-order-input-label-font-size,var(--limit-order-font-size))] dtw-leading-[var(--limit-order-input-label-line-height,var(--limit-order-line-height))] dtw-font-[var(--limit-order-input-label-font-weight,var(--limit-order-font-weight-light))] dtw-gap-x-2">
        <div className="dtw-flex dtw-flex-col dtw-gap-0.5 dtw-text-[color:var(--limit-order-secondary-content-color)]">
          <span>{title}</span>
          <span className="dtw-text-[length:var(--limit-order-font-size-xs)]">
            {subtitle}
          </span>
        </div>
        <Switch onChange={handleChange} defaultEnabled={enabled} />
      </div>
      {enabled && children}
    </div>
  )
}
