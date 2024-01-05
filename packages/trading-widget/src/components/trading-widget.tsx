import '../styles/index.css'
import type { FC } from 'react'
import { Tab } from '@headlessui/react'
import { SettingsPopover, TabButton } from './common'
import { DepositSettings } from './deposit'
import { WithdrawSettings } from './withdraw'

import { useTradingWidget, TABS } from './trading-widget.hooks'

export const TradingWidget: FC = () => {
  const { type, onTabChange } = useTradingWidget()

  return (
    <div className="dtw-flex dtw-w-full dtw-flex-col">
      <Tab.Group selectedIndex={TABS.indexOf(type)}>
        <Tab.List className="dtw-flex dtw-px-[var(--panel-tab-group-px)]">
          {TABS.map((tradingType) => (
            <Tab key={tradingType} className="dtw-hidden" />
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="dtw-flex dtw-justify-end">
            <SettingsPopover>
              <DepositSettings />
            </SettingsPopover>
          </Tab.Panel>
          <Tab.Panel className="dtw-flex dtw-justify-end">
            <SettingsPopover>
              <WithdrawSettings />
            </SettingsPopover>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <Tab.Group selectedIndex={TABS.indexOf(type)} onChange={onTabChange}>
        <Tab.List className="dtw-flex dtw-px-[var(--panel-tab-group-px)]">
          {TABS.map((tradingType) => (
            <TabButton key={tradingType} tradingType={tradingType} />
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>Deposit</Tab.Panel>
          <Tab.Panel>Withdraw</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
