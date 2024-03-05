import type { FC, PropsWithChildren } from 'react'

import { TooltipIcon } from '../../tooltip/tooltip-icon/tooltip-icon'

interface SettingsOptionProps {
  label: string
  tooltipText: string
}

export const SettingsOption: FC<PropsWithChildren<SettingsOptionProps>> = ({
  label,
  tooltipText,
  children,
}) => (
  <>
    <div className="dtw-flex dtw-items-center dtw-gap-x-1 dtw-text-[length:var(--panel-popup-font-size)] dtw-text-[color:var(--panel-popup-content-color,var(--panel-secondary-content-color))]">
      <span>{label}</span>
      <TooltipIcon text={tooltipText} placement="top" />
    </div>
    <div>{children}</div>
  </>
)
