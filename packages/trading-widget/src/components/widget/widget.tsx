import '../../styles/index.css'
import { Tab } from '@headlessui/react'
import type { FC } from 'react'

import { TABS } from 'constants/tab'

import { WidgetSettings } from './widget-settings/widget-settings'
import { WidgetTabs } from './widget-tabs/widget-tabs'
import type { WidgetProps } from './widget.hooks'
import { useWidget } from './widget.hooks'
import { DepositTabPanel } from '../deposit'
import { WithdrawTabPanel } from '../withdraw'

export const Widget: FC<WidgetProps> = ({ initialType }) => {
  const { type, onTabChange } = useWidget({ initialType })

  return (
    <Tab.Group selectedIndex={TABS.indexOf(type)} onChange={onTabChange}>
      <WidgetTabs>
        <WidgetSettings tradingType={type} />
      </WidgetTabs>
      <Tab.Panels>
        <DepositTabPanel />
        <WithdrawTabPanel />
      </Tab.Panels>
    </Tab.Group>
  )
}
