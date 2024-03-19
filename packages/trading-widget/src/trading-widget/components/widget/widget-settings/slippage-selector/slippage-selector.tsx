import classNames from 'classnames'
import type { FC, ReactNode } from 'react'

import { InfoTooltip } from 'trading-widget/components/common'
import { useGetSlippagePlaceholder } from 'trading-widget/hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useSlippageSelector } from './slippage-selector.hooks'

interface SlippageSelectorProps {
  children: ReactNode
  selected?: boolean
  className?: string
  onClick?: () => void
}

const SelectorContainer: FC<SlippageSelectorProps> = ({
  selected = false,
  children,
  className,
  onClick,
}) => {
  return (
    <div
      className={classNames(
        'dtw-cursor-pointer dtw-rounded-lg dtw-py-1 dtw-text-center dtw-text-sm',
        className,
        {
          'dtw-bg-themeBlue': selected,
          'dtw-bg-gray-700 dtw-text-white hover:dtw-bg-themeBlue': !selected,
        },
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const MIN_SLIPPAGE = 0
const MAX_SLIPPAGE = 100

export const SlippageSelector: FC = () => {
  const t = useTranslationContext()
  const {
    settings,
    tradingType,
    isCustomSlippage,
    invalidSlippage,
    onDefaultSlippageSelect,
    onCustomSlippageSelect,
  } = useSlippageSelector()

  const placeholder = useGetSlippagePlaceholder(
    tradingType,
    settings.slippage,
    settings.minSlippage,
  )

  return (
    <div className="dtw-flex dtw-items-center dtw-space-x-3">
      <SelectorContainer
        selected={!isCustomSlippage}
        className="dtw-w-14"
        onClick={onDefaultSlippageSelect}
      >
        <InfoTooltip text={t.autoSlippageDescription}>{t.auto}</InfoTooltip>
      </SelectorContainer>

      <div className="dtw-flex dtw-items-center dtw-space-x-1">
        <SelectorContainer selected={isCustomSlippage} className="dtw-w-20">
          <input
            className={classNames(
              'dtw-w-full dtw-bg-transparent dtw-px-1.5 dtw-outline-none focus:dtw-outline-none',
              {
                'dtw-text-red-600': invalidSlippage,
              },
            )}
            type="number"
            min={MIN_SLIPPAGE}
            max={MAX_SLIPPAGE}
            onChange={onCustomSlippageSelect}
            placeholder={placeholder}
            defaultValue={isCustomSlippage ? settings.slippage.toString() : ''}
          />
        </SelectorContainer>

        <span>%</span>
      </div>
    </div>
  )
}
