import { FC, PropsWithChildren } from 'react'

interface SettingsOptionProps {
  label: string
}

export const SettingsOption: FC<PropsWithChildren<SettingsOptionProps>> = ({
  label,
  children,
}) => (
  <>
    <div className="dtw-flex dtw-items-center dtw-gap-x-1 dtw-text-[length:var(--panel-popup-font-size)] dtw-text-[color:var(--panel-popup-content-color,var(--panel-secondary-content-color))]">
      <span>{label}</span>
    </div>
    <div>{children}</div>
  </>
)
