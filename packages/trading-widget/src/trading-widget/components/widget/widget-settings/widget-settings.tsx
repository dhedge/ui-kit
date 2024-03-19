import type { TradingPanelType } from '@dhedge/core-ui-kit/types'
import { Tab } from '@headlessui/react'

import type { FC } from 'react'

import { Layout } from 'trading-widget/components/common'
import { DepositSettings } from 'trading-widget/components/deposit'
import { WithdrawSettings } from 'trading-widget/components/withdraw'
import { TABS } from 'trading-widget/constants/tab'

interface WidgetSettingsProps {
  tradingType: TradingPanelType
}

export const WidgetSettings: FC<WidgetSettingsProps> = ({ tradingType }) => (
  <Tab.Group selectedIndex={TABS.indexOf(tradingType)}>
    <Tab.List className="dtw-flex dtw-px-[var(--panel-tab-group-px)]">
      {TABS.map((tradingType) => (
        <Tab key={tradingType} className="dtw-hidden" />
      ))}
    </Tab.List>
    <Tab.Panels>
      <Layout.Settings>
        <DepositSettings />
      </Layout.Settings>
      <Layout.Settings>
        <WithdrawSettings />
      </Layout.Settings>
    </Tab.Panels>
  </Tab.Group>
)
