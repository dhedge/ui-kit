import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

import { TRADING_PANEL_LOG_EVENT } from 'core-kit/const'
import { useTradingPanelLogger } from 'core-kit/hooks/state'

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
  const log = useTradingPanelLogger()

  const handleClick = () => {
    onClick?.()
    log?.(TRADING_PANEL_LOG_EVENT.TRADING_SETTINGS_OPENED)
  }

  return (
    <Popover
      className={classNames(
        'dtw-flex dtw-items-center dtw-justify-end',
        className,
      )}
    >
      <PopoverButton onClick={handleClick}>
        <Cog6ToothIcon
          className={classNames(
            'dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] hover:dtw-opacity-80 dtw-text-[color:var(--panel-icon-color,var(--panel-content-color))]',
            iconClassName,
          )}
        />
      </PopoverButton>
      <PopoverBackdrop className="dtw-absolute dtw-inset-0 dtw-bg-[var(--panel-popup-bg,var(--panel-secondary-color))] dtw-opacity-50" />
      <PopoverPanel
        className="dtw-absolute dtw-z-10 dtw-max-w-xs dtw-top-14 dtw-right-0 dtw-transition dtw-duration-100 dtw-ease-out data-[closed]:dtw-translate-x-1/2 data-[closed]:dtw-opacity-0"
        transition
      >
        <div className="dtw-rounded-l-[var(--panel-radius)] dtw-bg-[var(--panel-popup-bg,var(--panel-secondary-color))] dtw-p-4 dtw-flex dtw-flex-col dtw-gap-y-2.5">
          {children}
        </div>
      </PopoverPanel>
    </Popover>
  )
}
