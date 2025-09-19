import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

interface AlertProps {
  className?: string
  type?: 'error' | 'warning' | 'info'
}

export const Alert: FC<PropsWithChildren<AlertProps>> = ({
  className,
  children,
  type = 'error',
}) => (
  <div
    className={classNames(
      'dtw-rounded-[var(--panel-radius)] dtw-p-3',
      {
        'dtw-bg-[var(--panel-alert-error-bg)] dtw-text-[var(--panel-alert-error-color)]':
          type === 'error',
        'dtw-bg-[var(--panel-alert-warning-bg)] dtw-text-[var(--panel-alert-warning-color)]':
          type === 'warning',
        'dtw-bg-[var(--panel-alert-info-bg)] dtw-text-[var(--panel-alert-info-color)]':
          type === 'info',
      },
      className,
    )}
  >
    {children}
  </div>
)
