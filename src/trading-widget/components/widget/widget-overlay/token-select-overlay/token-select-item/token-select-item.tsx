import { CheckIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

import { TokenBadge } from 'trading-widget/components/common'

import type { TokenSelectItemProps } from 'trading-widget/components/widget/widget-overlay/token-select-overlay/token-select-item/token-select-item.hooks'
import { useTokenSelectItem } from 'trading-widget/components/widget/widget-overlay/token-select-overlay/token-select-item/token-select-item.hooks'

export const TokenSelectItem = ({
  token,
  onSelect,
  onClose,
  isActive = false,
}: TokenSelectItemProps) => {
  const { onClick, formattedBalance } = useTokenSelectItem({
    token,
    onSelect,
    onClose,
    isActive,
  })

  return (
    <div
      className="dtw-flex dtw-items-center dtw-rounded-xl dtw-gap-x-2 dtw-py-3 dtw-pl-4 dtw-pr-3"
      onClick={onClick}
    >
      <TokenBadge
        symbol={token.symbol}
        iconSymbols={[token.symbol]}
        size="xl"
        symbolClasses={classNames(
          'group-hover:dtw-opacity-100 dtw-text-sm dtw-font-medium',
          {
            'dtw-opacity-100 sm:dtw-opacity-80': !isActive,
            'dtw-opacity-100': isActive,
          },
        )}
        className={classNames('group-hover:dtw-opacity-100', {
          'dtw-opacity-100 sm:dtw-opacity-50': !isActive,
          'dtw-opacity-100': isActive,
        })}
      />
      <div className="dtw-flex dtw-flex-col dtw-self-end dtw-text-sm dtw-font-light dtw-text-[color:var(--panel-balance-content-color)]">
        {isActive && (
          <CheckIcon className="dtw-w-4 dtw-self-end dtw-text-themeGreen" />
        )}
        <div>
          <span className="dtw-mr-1 dtw-text-xs">{token.symbol}</span>
          {formattedBalance}
        </div>
      </div>
    </div>
  )
}
