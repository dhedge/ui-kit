import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'

import type { ComponentType, ReactNode, SVGProps } from 'react'

import { TooltipIcon } from 'components/common'

import type { ThemeType } from 'types'
import { THEME_TYPE } from 'types'

export interface TransactionDisclosureItemProps {
  tooltipText: string
  label: string
  value?: ReactNode
  children?: ReactNode
  type?: ThemeType
  className?: string
  emphasised?: boolean
}

const ITEM_ICON_MAP: Record<
  ThemeType,
  ComponentType<Omit<SVGProps<SVGSVGElement>, 'ref'>>
> = {
  [THEME_TYPE.DEFAULT]: QuestionMarkCircleIcon,
  [THEME_TYPE.ERROR]: ExclamationCircleIcon,
  [THEME_TYPE.SUCCESS]: CheckCircleIcon,
  [THEME_TYPE.WARNING]: ExclamationCircleIcon,
  [THEME_TYPE.CUSTOM]: QuestionMarkCircleIcon,
}

export const TransactionDisclosureItem = ({
  tooltipText,
  value,
  label,
  children,
  type = THEME_TYPE.DEFAULT,
  className,
  emphasised = false,
}: TransactionDisclosureItemProps) => {
  return (
    <div
      className={classNames(
        'dtw-flex dtw-grow dtw-items-center dtw-leading-[var(--panel-label-line-height,var(--panel-line-height-xs))] dtw-font-[var(--panel-meta-font-weight,var(--panel-font-weight-light))] dtw-gap-x-1',
        {
          'dtw-text-[length:var(--panel-label-font-size,var(--panel-font-size-xs))] dtw-text-[color:var(--panel-secondary-content-color)]':
            !emphasised,
          'dtw-text-[length:var(--panel-input-label-font-size,var(--panel-font-size-sm))] dtw-text-[color:var(--panel-content-color)]':
            emphasised,
        },
        className,
      )}
    >
      <div className="dtw-flex dtw-grow dtw-items-center dtw-justify-between">
        <div className="dtw-flex dtw-items-center dtw-gap-x-1">
          <TooltipIcon
            text={tooltipText}
            placement="right"
            Icon={ITEM_ICON_MAP[type]}
            iconClassName={classNames({
              'dtw-text-[color:var(--panel-error-content-color)]':
                type === THEME_TYPE.ERROR,
              'dtw-text-[color:var(--panel-warning-content-color)]':
                type === THEME_TYPE.WARNING,
            })}
          />
          <p
            className={classNames({
              'dtw-text-[color:var(--panel-error-content-color)]':
                type === THEME_TYPE.ERROR,
              'dtw-text-[color:var(--panel-warning-content-color)]':
                type === THEME_TYPE.WARNING,
            })}
          >
            {label}
          </p>
        </div>
        <div
          className={classNames({
            'dtw-text-[color:var(--panel-error-content-color)]':
              type === THEME_TYPE.ERROR,
            'dtw-text-[color:var(--panel-warning-content-color)]':
              type === THEME_TYPE.WARNING,
          })}
        >
          {value}
        </div>
      </div>
      {children}
    </div>
  )
}
