import { Tab } from '@headlessui/react'
import classNames from 'classnames'
import type { FC } from 'react'

import type { TradingPanelType } from 'core-kit/types'

import { useTradingTypeName } from 'trading-widget/hooks'

interface TabProps {
  tradingType: TradingPanelType
}

export const TabButton: FC<TabProps> = ({ tradingType }) => {
  const name = useTradingTypeName(tradingType)

  return (
    <Tab
      className={({ selected }) =>
        classNames(
          'dtw-relative dtw-text-[length:var(--panel-tab-font-size,var(--panel-font-size-sm))] dtw-px-[var(--panel-tab-px)] dtw-py-[var(--panel-tab-py)] dtw-font-[var(--panel-tab-font-weight,var(--panel-font-weight-bold))] dtw-leading-[var(--panel-tab-line-height, var(--panel-line-height))] dtw-outline-0',
          {
            'dtw-text-[color:var(--panel-tab-select-content-color,var(--panel-content-color))]':
              selected,
            'dtw-text-[color:var(--panel-tab-content-color,var(--panel-neutral-content-color))] hover:dtw-text-[color:var(--panel-tab-hover-content-color,var(--panel-content-hover-color))]':
              !selected,
          },
        )
      }
    >
      {({ selected }) => (
        <>
          <span>{name}</span>
          {selected ? (
            <div className="dtw-absolute dtw-bottom-0 dtw-left-0 dtw-right-0 dtw-h-full dtw-rounded-[var(--panel-radius-secondary)] dtw-bg-[var(--panel-tab-bg,var(--panel-neutral-color))] dtw-shadow-md dtw-pointer-events-none" />
          ) : null}
        </>
      )}
    </Tab>
  )
}
