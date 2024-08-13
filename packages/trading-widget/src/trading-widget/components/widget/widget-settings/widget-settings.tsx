import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react'

import type { FC } from 'react'

import type { TradingPanelType } from 'core-kit/types'

import { Layout } from 'trading-widget/components/common'
import { DepositSettings } from 'trading-widget/components/deposit'
import { WithdrawSettings } from 'trading-widget/components/withdraw'
import { TABS } from 'trading-widget/constants/tab'

interface WidgetSettingsProps {
  tradingType: TradingPanelType
}

export const WidgetSettings: FC<WidgetSettingsProps> = ({ tradingType }) => (
  <TabGroup selectedIndex={TABS.indexOf(tradingType)}>
    <TabList className="dtw-flex dtw-px-[var(--panel-tab-group-px)]">
      {TABS.map((tradingType) => (
        <Tab key={tradingType} className="dtw-hidden" />
      ))}
    </TabList>
    <TabPanels>
      <Layout.Settings>
        <DepositSettings />
      </Layout.Settings>
      <Layout.Settings>
        <WithdrawSettings />
      </Layout.Settings>
    </TabPanels>
  </TabGroup>
)
