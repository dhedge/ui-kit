import classNames from 'classnames'
import type { FC, HTMLAttributes, ReactElement } from 'react'

import { useTranslationContext } from 'providers/translation-provider'
import type { TokenIconSize } from 'types'

import { TokenIcon } from '../../icon/token-icon/token-icon'
import { Skeleton } from '../../skeleton/skeleton'

interface TokenBadgeProps {
  symbol: string
  iconSymbols: string[]
  size?: TokenIconSize
  symbolClasses?: HTMLAttributes<HTMLDivElement>['className']
  CustomIcon?: ReactElement
  customTitle?: string
  className?: string
}

export const TokenBadge: FC<TokenBadgeProps> = ({
  symbol,
  iconSymbols,
  size,
  symbolClasses = 'dtw-text-sm dtw-font-medium',
  CustomIcon,
  customTitle,
  className,
}) => {
  const t = useTranslationContext()
  const title = customTitle || (symbol === 'all' ? t.allAssets : symbol)

  return (
    <div
      className={classNames(
        'dtw-flex dtw-w-full dtw-items-center dtw-space-x-1.5',
        className,
      )}
    >
      {CustomIcon ?? (
        <TokenIcon
          size={size}
          symbols={iconSymbols}
          className="dtw-flex-shrink-0"
        />
      )}
      <div className={symbolClasses} title={title}>
        {title || <Skeleton className="dtw-w-[70px]" />}
      </div>
    </div>
  )
}
