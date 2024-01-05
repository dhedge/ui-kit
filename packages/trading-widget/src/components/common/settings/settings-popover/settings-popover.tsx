import { PropsWithChildren } from 'react'
import { Popover } from '@headlessui/react'
import { CogIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC } from 'react'

interface SettingsPopoverProps {
  className?: string
  iconClassName?: string
  onClick?: () => void
}

export const SettingsPopover: FC<PropsWithChildren<SettingsPopoverProps>> = ({
  className,
  iconClassName,
  onClick,
  children,
}) => {
  return (
    <Popover className={className}>
      <Popover.Button onClick={onClick}>
        <CogIcon
          className={classNames(
            'dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] hover:dtw-animate-spin',
            iconClassName,
          )}
        />
      </Popover.Button>

      <Popover.Panel className="dtw-absolute dtw-right-2 dtw-z-10 dtw-w-full dtw-max-w-xs">
        <div className="dtw-rounded-[var(--panel-radius)] dtw-bg-[var(--panel-popup-bg,var(--panel-secondary-color))] dtw-p-4 dtw-ring-1 dtw-ring-[var(--panel-popup-border-color,var(--panel-secondary-content-color))] dtw-flex dtw-flex-col dtw-gap-1.5">
          {children}
        </div>
      </Popover.Panel>
    </Popover>
  )
}
