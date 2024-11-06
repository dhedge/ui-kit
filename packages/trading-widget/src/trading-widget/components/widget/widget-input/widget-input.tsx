import classNames from 'classnames'
import type { FC } from 'react'

import { MaxBalanceButton, Spinner } from 'trading-widget/components/common'
import { THEME_TYPE } from 'trading-widget/types'

import { TokenSelector } from './token-selector/token-selector'

import type { WidgetInputProps } from './widget-input.hooks'
import { useWidgetInput } from './widget-input.hooks'
import { disableScrollForNumberInput } from './widget-input.utils'

export const WidgetInput: FC<WidgetInputProps> = (props) => {
  const {
    inputRef,
    usdAmount,
    autoFocus,
    value,
    onContainerClick,
    onMaxBalanceClick,
    onInputChange,
  } = useWidgetInput(props)
  const {
    label,
    assetSymbol,
    onInputFocus,
    disabled = false,
    displayMax = false,
    displayCalculatedValue = false,
    type = THEME_TYPE.DEFAULT,
    isLoading = false,
  } = props

  const textColorClassNames = classNames({
    'dtw-text-[color:var(--panel-error-content-color)]':
      type === THEME_TYPE.ERROR && !isLoading,
    'dtw-text-[color:var(--panel-warning-content-color)]':
      type === THEME_TYPE.WARNING && !isLoading,
  })

  return (
    <div
      className={classNames(
        'dtw-flex dtw-flex-col dtw-gap-[var(--panel-input-group-gap,var(--panel-gap))] dtw-rounded-[var(--panel-input-radius,var(--panel-radius))] dtw-border dtw-bg-[var(--panel-input-bg,var(--panel-neutral-color))] dtw-py-[var(--panel-input-py)] dtw-px-[var(--panel-input-px)] focus-within:dtw-border-[var(--panel-input-focus-border-color)] focus-within:dtw-bg-[var(--panel-input-focus-bg)] dtw-shadow-md',
        {
          'dtw-border-[var(--panel-input-border-color)]':
            type === THEME_TYPE.DEFAULT || isLoading,
          'dtw-border-[color:var(--panel-error-content-color)]':
            type === THEME_TYPE.ERROR && !isLoading,
          'dtw-border-[color:var(--panel-warning-content-color)]':
            type === THEME_TYPE.WARNING && !isLoading,
        },
      )}
      onClick={onContainerClick}
    >
      <div className="dtw-flex dtw-justify-between dtw-text-[length:var(--panel-input-label-font-size,var(--panel-font-size-sm))] dtw-leading-[var(--panel-input-label-line-height,var(--panel-line-height-sm))] dtw-font-[var(--panel-input-label-font-weight,var(--panel-font-weight-light))] dtw-gap-x-2">
        <span className={textColorClassNames}>{label}</span>
        <div className="dtw-flex dtw-items-center dtw-gap-[var(--panel-input-price-gap,var(--panel-gap))] dtw-flex-1">
          {displayCalculatedValue && (
            <>
              {isLoading ? (
                <div className="dtw-ml-auto dtw-h-[22px]">
                  <Spinner className="dtw-stroke-[color:var(--panel-accent-from-color)] dtw-h-[var(--panel-icon-secondary-size)] sm:dtw-h-[var(--panel-icon-secondary-size-sm)] dtw-w-[var(--panel-icon-secondary-size)] sm:dtw-w-[var(--panel-icon-secondary-size-sm)]" />
                </div>
              ) : (
                <input
                  className={classNames(
                    'dtw-appearance-none dtw-bg-transparent dtw-outline-none dtw-text-right dtw-pointer-events-none dtw-flex-1',
                    {
                      'dtw-text-[color:var(--panel-input-loading-content-color,var(--panel-loading-content-color))]':
                        isLoading,
                    },
                    textColorClassNames,
                  )}
                  value={usdAmount}
                  disabled
                />
              )}
            </>
          )}
          {displayMax && <MaxBalanceButton onClick={onMaxBalanceClick} />}
        </div>
      </div>
      <div className="dtw-flex dtw-items-center dtw-gap-x-2">
        <div className="transparent-scrollbar dtw-flex-1 dtw-overflow-x-auto">
          <input
            className={classNames(
              'dtw-appearance-none dtw-bg-transparent dtw-text-[color:var(--panel-input-content-color,var(--panel-content-color))] placeholder:dtw-text-[color:var(--panel-input-placeholder-color,var(--panel-secondary-content-color))] dtw-text-[length:var(--panel-input-font-size,var(--panel-font-size-sm))] dtw-leading-[var(--panel-input-line-height,var(--panel-line-height-sm))] dtw-font-[var(--panel-input-font-weight,var(--panel-font-weight-light))] dtw-outline-none focus:dtw-outline-none lg:dtw-text-[length:var(--panel-input-font-size-lg,var(--panel-font-size-lg))] lg:dtw-leading-[var(--panel-input-line-height-lg,var(--panel-line-height-lg))] dtw-w-full',
              textColorClassNames,
            )}
            ref={inputRef}
            autoFocus={autoFocus}
            type="number"
            min={0}
            value={value}
            onChange={onInputChange}
            onFocus={onInputFocus}
            placeholder="0"
            disabled={disabled}
            onWheelCapture={disableScrollForNumberInput}
          />
        </div>
        <TokenSelector symbol={assetSymbol} />
      </div>
    </div>
  )
}
