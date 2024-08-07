import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

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
    <Popover className={classNames('dtw-flex dtw-items-center', className)}>
      <PopoverButton onClick={onClick}>
        <Cog6ToothIcon
          className={classNames(
            'dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] hover:dtw-opacity-80',
            iconClassName,
          )}
        />
      </PopoverButton>
      <PopoverBackdrop className="dtw-absolute dtw-inset-0 dtw-bg-[var(--panel-popup-bg,var(--panel-secondary-color))] dtw-opacity-50" />
      <PopoverPanel
        className="dtw-absolute dtw-z-10 dtw-max-w-xs dtw-top-14 dtw-right-0 dtw-transition dtw-duration-100 dtw-ease-out data-[closed]:dtw-translate-x-1/2 data-[closed]:dtw-opacity-0"
        transition
      >
        <div className="dtw-rounded-l-[var(--panel-radius)] dtw-bg-[var(--panel-popup-bg,var(--panel-secondary-color))] dtw-p-4 dtw-flex dtw-flex-col dtw-gap-1.5">
          {children}
        </div>
      </PopoverPanel>
    </Popover>
  )
}
