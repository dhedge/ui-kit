import classNames from 'classnames'
import type { FC } from 'react'

import { useExchangeRate } from 'core-kit/hooks/trading'

import { Spinner } from 'trading-widget/components/common/spinner/spinner'
import { THEME_TYPE } from 'trading-widget/types'

interface ExchangeRateProps {
  className?: string
}

export const ExchangeRate: FC<ExchangeRateProps> = ({ className }) => {
  const { value, isLoading } = useExchangeRate()

  return (
    <div
      className={classNames(
        'dtw-flex dtw-h-[var(--panel-icon-secondary-size)] sm:dtw-h-[var(--panel-icon-secondary-size-sm)] dtw-justify-end dtw-gap-x-2',
        className,
      )}
    >
      {isLoading && (
        <Spinner
          type={THEME_TYPE.CUSTOM}
          className="dtw-stroke-[color:var(--panel-accent-from-color)] dtw-h-[var(--panel-icon-secondary-size)] sm:dtw-h-[var(--panel-icon-secondary-size-sm)] dtw-w-[var(--panel-icon-secondary-size)] sm:dtw-w-[var(--panel-icon-secondary-size-sm)]"
        />
      )}
      <p
        className={classNames(
          'dtw-text-right dtw-text-[length:var(--panel-label-font-size,var(--panel-font-size-xs))] dtw-leading-[var(--panel-label-line-height,var(--panel-line-height-xs))] dtw-text-[color:var(--panel-secondary-content-color)] dtw-font-[var(--panel-meta-font-weight,var(--panel-font-weight-light))]',
          {
            'dtw-text-[color:var(--panel-loading-content-color)]': isLoading,
          },
        )}
      >
        {value}
      </p>
    </div>
  )
}
