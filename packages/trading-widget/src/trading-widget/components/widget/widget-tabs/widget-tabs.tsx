import { Tab } from '@headlessui/react'

import type { FC, PropsWithChildren } from 'react'

import { TabButton } from 'trading-widget/components/common'
import { TABS } from 'trading-widget/constants/tab'

export const WidgetTabs: FC<PropsWithChildren> = ({ children }) => (
  <Tab.List className="dtw-flex dtw-px-[var(--panel-tab-group-px)] dtw-justify-between dtw-items-center">
    <div>
      {TABS.map((tradingType) => (
        <TabButton key={tradingType} tradingType={tradingType} />
      ))}
    </div>
    {children}
  </Tab.List>
)
