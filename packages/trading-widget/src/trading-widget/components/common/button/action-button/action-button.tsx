import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

import { Spinner } from 'trading-widget/components/common/spinner/spinner'

export interface ActionButtonProps {
  onClick?: () => void
  highlighted?: boolean
  disabled?: boolean
  className?: string
  type?: 'submit' | 'button'
  loading?: boolean
}

const NON_HIGHLIGHTED_CLASSNAMES = [
  'dtw-bg-transparent',
  'dtw-border-[var(--panel-action-outline-button-border-color,var(--panel-border-color))]',
  '!dtw-text-[color:var(--panel-action-outline-button-color,var(--panel-content-color))]',
  'active:dtw-border-opacity-100',
  'hover:enabled:dtw-border-[var(--panel-action-outline-button-border-hover-color)]',
]

const HIGHLIGHTED_CLASSNAMES = [
  '!dtw-text-[color:var(--panel-action-accent-button-color,var(--panel-accent-content-color))]',
  'dtw-bg-gradient-to-r',
  'dtw-from-[var(--panel-action-accent-button-bg-from,var(--panel-accent-from-color))]',
  'dtw-to-[var(--panel-action-accent-button-bg-to,var(--panel-accent-to-color))]',
  'dtw-border-[color:var(--panel-action-accent-button-border-color)]',
  'dtw-border-[length:var(--panel-action-accent-button-border-width)]',
  'hover:enabled:dtw-from-[var(--panel-action-accent-button-hover-bg-from,var(--panel-accent-hover-from-color))]',
  'hover:enabled:dtw-to-[var(--panel-action-accent-button-hover-bg-to,var(--panel-accent-hover-to-color))]',
]

export const ActionButton: FC<PropsWithChildren<ActionButtonProps>> = ({
  children,
  onClick,
  highlighted = true,
  disabled = false,
  className,
  type,
  loading = false,
}) => (
  <button
    className={classNames(
      'dtw-rounded-[var(--panel-input-button-radius,var(--panel-radius))]',
      'dtw-font-medium',
      'dtw-border',
      'dtw-transition-border',
      'dtw-duration-500',
      'dtw-ease-in-out',
      'disabled:dtw-opacity-50',
      'dtw-py-2',
      'dtw-px-5',
      'dtw-w-full',
      {
        [HIGHLIGHTED_CLASSNAMES.join(' ')]: highlighted,
        [NON_HIGHLIGHTED_CLASSNAMES.join(' ')]: !highlighted,
        'dtw-flex dtw-items-center dtw-justify-center dtw-gap-1': loading,
      },
      className,
    )}
    onClick={onClick}
    disabled={disabled || loading}
    type={type}
  >
    {loading && <Spinner className="dtw-h-4 dtw-w-4" />}
    {children}
  </button>
)
