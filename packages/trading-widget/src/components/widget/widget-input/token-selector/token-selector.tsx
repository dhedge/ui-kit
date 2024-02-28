import type { FC } from 'react'
import { ChevronDownIcon, CircleStackIcon } from '@heroicons/react/20/solid'

import { TokenBadge } from 'components/common'

import { TokenSelectorProps, useTokenSelector } from './token-selector.hooks'
import { useTranslationContext } from 'providers/translation-provider'

export const TokenSelector: FC<TokenSelectorProps> = ({ symbol }) => {
  const { isAllSymbol, onClick } = useTokenSelector({ symbol })
  const t = useTranslationContext()

  return (
    <button
      className="dtw-flex dtw-items-center dtw-gap-1 dtw-rounded-[var(--panel-input-button-radius,var(--panel-radius))] dtw-border dtw-border-[var(--panel-input-button-border-color,var(--panel-accent-to-color))] dtw-bg-[var(--panel-input-button-bg,var(--panel-secondary-color))] dtw-px-[var(--panel-input-button-px)] dtw-py-[var(--panel-input-button-py)] hover:dtw-opacity-[var(--panel-action-hover-opacity)] dtw-opacity-[var(--panel-action-opacity)]"
      onClick={onClick}
    >
      <TokenBadge
        symbol={symbol}
        iconSymbols={[symbol]}
        symbolClasses="dtw-font-[var(--panel-input-token-font-weight,var(--panel-font-weight-medium))] dtw-text-[length:var(--panel-input-token-font-size,var(--panel-font-size-xs))] dtw-line-height-[length:var(--panel-input-token-line-height,var(--panel-line-height-xs))] sm:dtw-text-[length:var(--panel-input-token-font-size-sm,var(--panel-font-size))] sm:dtw-leading-[var(--panel-input-token-line-height-sm,var(--panel-line-height))]"
        CustomIcon={
          isAllSymbol ? (
            <CircleStackIcon className="dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]" />
          ) : undefined
        }
        customTitle={isAllSymbol ? t.all : undefined}
      />
      <ChevronDownIcon
        className="dtw-flex-shrink-0 dtw-text-[color:var(--panel-icon-color,var(--panel-content-color))] dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]"
        aria-hidden="true"
      />
    </button>
  )
}
