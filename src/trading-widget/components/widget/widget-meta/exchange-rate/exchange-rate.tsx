import classNames from 'classnames'
import type { FC } from 'react'

import { useExchangeRate } from 'core-kit/hooks/trading'

import { Spinner } from 'trading-widget/components/common/spinner/spinner'

interface ExchangeRateProps {
  className?: string
}

export const ExchangeRate: FC<ExchangeRateProps> = ({ className }) => {
  const { value, isLoading } = useExchangeRate()

  return (
    <div
      className={classNames(
        'dtw-flex dtw-h-[var(--panel-icon-secondary-size)] dtw-justify-end dtw-gap-x-2',
        className,
      )}
    >
      {isLoading && (
        <Spinner className="dtw-stroke-[color:var(--panel-accent-from-color)] dtw-h-[var(--panel-icon-secondary-size)] dtw-w-[var(--panel-icon-secondary-size)]" />
      )}
      <p
        className={classNames(
          'dtw-text-right dtw-text-[length:var(--panel-meta-font-size)] dtw-leading-[var(--panel-meta-line-height)] dtw-text-[color:var(--panel-secondary-content-color)] dtw-font-[var(--panel-meta-font-weight,var(--panel-font-weight-light))]',
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
