import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

interface AlertProps {
  className?: string
}

export const Alert: FC<PropsWithChildren<AlertProps>> = ({
  className,
  children,
}) => (
  <div
    className={classNames(
      'dtw-bg-error/30 dtw-rounded-[var(--panel-radius)] dtw-p-2',
      className,
    )}
  >
    {children}
  </div>
)
