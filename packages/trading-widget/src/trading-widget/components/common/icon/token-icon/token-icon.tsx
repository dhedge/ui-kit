import classNames from 'classnames'
import type { FC } from 'react'
import { useState } from 'react'

import { Image as DefaultImage } from 'trading-widget/components/default-examples/image/image'
import { useCryptoIcon } from 'trading-widget/hooks'
import { useComponentContext } from 'trading-widget/providers/component-provider'
import type { TokenIconSize } from 'trading-widget/types'

export interface TokenIconProps {
  symbols: string[]
  size?: TokenIconSize
  className?: string
}

interface IconLoadingErrors {
  [iconSymbol: string]: boolean
}

export const getRowClasses = (index: number, length: number) => {
  if (index === 0) {
    return `dtw-z-${(length - 1) * 10}`
  }
  return `dtw--ml-2 dtw-z-${(length - index - 1) * 10}`
}

export const getSizeClasses = (size: TokenIconSize) => {
  switch (size) {
    case 'xs':
      return {
        height: '!dtw-h-3 sm:!dtw-h-4 ',
        width: '!dtw-w-3 sm:!dtw-w-4',
        diameter: 16,
      }
    case 'sm':
      return {
        height: '!dtw-h-4 sm:!dtw-h-5 ',
        width: '!dtw-w-4 sm:!dtw-w-5',
        diameter: 20,
      }
    case 'm':
      return {
        height: '!dtw-h-5 sm:!dtw-h-6 ',
        width: '!dtw-w-5 sm:!dtw-w-6',
        diameter: 24,
      }
    case 'lg':
      return {
        height: '!dtw-h-7 sm:!dtw-h-8 ',
        width: '!dtw-w-7 sm:!dtw-w-8',
        diameter: 32,
      }
    case 'xl':
      return {
        height: '!dtw-h-9 sm:!dtw-h-10 ',
        width: '!dtw-w-9 sm:!dtw-w-10',
        diameter: 36,
      }
  }
}

export const TokenIcon: FC<TokenIconProps> = ({
  symbols,
  size = 'm',
  className = '',
}) => {
  const { Image = DefaultImage } = useComponentContext()
  const symbolsString = symbols.join('')
  const [error, setError] = useState<IconLoadingErrors>({
    [symbolsString]: false,
  })
  const { height, width, diameter } = getSizeClasses(size)
  const icons = useCryptoIcon(symbols)

  if (!icons?.length || !icons[0] || error[symbolsString]) return null

  const handleIconLoadingError = () =>
    setError((state) => ({ ...state, [symbolsString]: true }))

  if (icons.length === 1) {
    return (
      <Image
        src={icons[0]}
        alt={`${symbols[0]} icon`}
        className={classNames(height, width, className)}
        width={diameter}
        height={diameter}
        onError={handleIconLoadingError}
      />
    )
  }

  return (
    <span
      className={`dtw-flex-no-wrap dtw-z-0 dtw-flex ${height} ${className}`}
    >
      {icons.map((icon, index) => (
        <Image
          key={index}
          src={icon}
          alt={`${symbols[index]} icon`}
          className={classNames(
            'dtw-inline-block dtw-overflow-visible dtw-rounded-full',
            width,
            height,
            getRowClasses(index, symbols.length),
          )}
          width={diameter}
          height={diameter}
          onError={handleIconLoadingError}
        />
      ))}
    </span>
  )
}
