import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'

import type { ComponentType, ReactNode, SVGProps } from 'react'

import { TooltipIcon } from 'trading-widget/components/common'

import type { ThemeType } from 'trading-widget/types'
import { THEME_TYPE } from 'trading-widget/types'

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
        'dtw-flex dtw-grow dtw-items-center dtw-font-[var(--panel-meta-font-weight,var(--panel-font-weight-light))] dtw-gap-x-1',
        {
          'dtw-text-[length:var(--panel-meta-font-size)] dtw-leading-[var(--panel-meta-line-height)] dtw-text-[color:var(--panel-secondary-content-color)]':
            !emphasised,
          'dtw-text-[length:var(--panel-meta-emphasised-font-size)] dtw-leading-[var(--panel-meta-emphasised-line-height)] dtw-text-[color:var(--panel-content-color)]':
            emphasised,
        },
        className,
      )}
    >
      <div className="dtw-flex dtw-grow dtw-items-start dtw-justify-between">
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
