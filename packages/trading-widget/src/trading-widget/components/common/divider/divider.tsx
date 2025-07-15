import classNames from 'classnames'
import type { FC } from 'react'

export interface DividerProps {
  className?: string
}

export const Divider: FC<DividerProps> = ({ className }) => (
  <div
    className={classNames(
      'dtw-w-full dtw-h-[1px] dtw-bg-[var(--panel-divider-color)] dtw-shrink-0',
      className,
    )}
  />
)
