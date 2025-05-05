import { TabList } from '@headlessui/react'

import type { FC, PropsWithChildren } from 'react'

import { TabButton } from 'trading-widget/components/common'
import { TABS } from 'trading-widget/constants/tab'

export const WidgetTabs: FC<PropsWithChildren> = ({ children }) => (
  <TabList className="dtw-flex dtw-px-[var(--panel-tab-group-px)] dtw-justify-between dtw-items-center">
    <div className="dtw-bg-[var(--panel-tab-list-bg)] dtw-rounded-[var(--panel-tab-list-radius)] dtw-px-[var(--panel-tab-list-px)] dtw-py-[var(--panel-tab-list-py)]">
      {TABS.map((tradingType) => (
        <TabButton key={tradingType} tradingType={tradingType} />
      ))}
    </div>
    {children}
  </TabList>
)
