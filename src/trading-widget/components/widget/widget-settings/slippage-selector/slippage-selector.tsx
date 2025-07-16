import classNames from 'classnames'
import type { FC, ReactNode } from 'react'

import { useSlippageSelector } from 'trading-widget/components/widget/widget-settings/slippage-selector/slippage-selector.hooks'
import { useGetSlippagePlaceholder } from 'trading-widget/hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

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
        'dtw-cursor-pointer dtw-rounded-[var(--panel-input-button-radius,var(--panel-radius))] dtw-py-1 dtw-text-center dtw-text-sm',
        className,
        {
          'dtw-bg-[color:var(--panel-switch-bg-checked)] !dtw-text-[color:var(--panel-switch-color-checked)]':
            selected,
          'dtw-bg-[color:var(--panel-switch-bg)] dtw-text-white hover:dtw-opacity-80 !dtw-text-[color:var(--panel-switch-color)]':
            !selected,
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

  const placeholder = useGetSlippagePlaceholder({
    tradingType,
    slippage: settings.slippage,
    minSlippage: settings.minSlippage,
  })

  return (
    <div className="dtw-flex dtw-items-stretch dtw-gap-x-3">
      <SelectorContainer
        selected={!isCustomSlippage}
        className="dtw-w-14"
        onClick={onDefaultSlippageSelect}
      >
        {t.auto}
      </SelectorContainer>

      <div className="dtw-flex dtw-items-center dtw-gap-x-1 dtw-flex-1">
        <SelectorContainer selected={isCustomSlippage} className="dtw-w-14">
          <input
            className={classNames(
              'dtw-w-full dtw-bg-transparent dtw-px-1.5 dtw-outline-none focus:dtw-outline-none dtw-text-center',
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
