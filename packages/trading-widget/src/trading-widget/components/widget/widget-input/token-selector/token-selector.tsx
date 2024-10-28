import { ChevronDownIcon, CircleStackIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import type { FC } from 'react'

import { TokenBadge } from 'trading-widget/components/common'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import type { TokenSelectorProps } from './token-selector.hooks'
import { useTokenSelector } from './token-selector.hooks'

export const TokenSelector: FC<TokenSelectorProps> = ({ symbol }) => {
  const { isAllSymbol, onClick, disabled, hideTokenIcon } = useTokenSelector({
    symbol,
  })
  const t = useTranslationContext()

  return (
    <button
      className={classNames(
        'dtw-flex dtw-items-center dtw-gap-1 dtw-rounded-[var(--panel-input-button-radius,var(--panel-radius))] dtw-border dtw-border-[var(--panel-input-button-border-color,var(--panel-accent-to-color))] !dtw-bg-[var(--panel-input-button-bg,var(--panel-secondary-color))] dtw-px-[var(--panel-input-button-px)] dtw-py-[var(--panel-input-button-py)] hover:dtw-opacity-[var(--panel-action-hover-opacity)] dtw-opacity-[var(--panel-action-opacity)]',
        { 'dtw-pr-2 dtw-pointer-events-none': disabled },
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <TokenBadge
        symbol={symbol}
        iconSymbols={hideTokenIcon ? [] : [symbol]}
        symbolClasses="dtw-font-[var(--panel-input-token-font-weight,var(--panel-font-weight-medium))] dtw-text-[length:var(--panel-input-token-font-size,var(--panel-font-size-xs))] dtw-line-height-[length:var(--panel-input-token-line-height,var(--panel-line-height-xs))] sm:dtw-text-[length:var(--panel-input-token-font-size-sm,var(--panel-font-size))] sm:dtw-leading-[var(--panel-input-token-line-height-sm,var(--panel-line-height))]"
        CustomIcon={
          isAllSymbol ? (
            <CircleStackIcon className="dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]" />
          ) : undefined
        }
        customTitle={isAllSymbol ? t.all : undefined}
      />
      {!disabled && (
        <ChevronDownIcon
          className="dtw-flex-shrink-0 dtw-text-[color:var(--panel-icon-color,var(--panel-content-color))] dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]"
          aria-hidden="true"
        />
      )}
    </button>
  )
}
