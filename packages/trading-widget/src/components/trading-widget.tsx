import '../styles/index.css'
import { Tab } from '@headlessui/react'
import type { FC } from 'react'

import { SettingsPopover, TabButton } from './common'
import { DepositSettings, DepositTabPanel } from './deposit'
import { TABS, useTradingWidget } from './trading-widget.hooks'
import { WithdrawSettings, WithdrawTabPanel } from './withdraw'

export const TradingWidget: FC = () => {
  const { type, onTabChange } = useTradingWidget()

  return (
    <div className="dtw-flex dtw-w-full dtw-flex-col">
      <Tab.Group selectedIndex={TABS.indexOf(type)} onChange={onTabChange}>
        <Tab.List className="dtw-flex dtw-px-[var(--panel-tab-group-px)] dtw-justify-between dtw-items-center">
          <div>
            {TABS.map((tradingType) => (
              <TabButton key={tradingType} tradingType={tradingType} />
            ))}
          </div>
          <Tab.Group selectedIndex={TABS.indexOf(type)}>
            <Tab.List className="dtw-flex dtw-px-[var(--panel-tab-group-px)]">
              {TABS.map((tradingType) => (
                <Tab key={tradingType} className="dtw-hidden" />
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <SettingsPopover className="dtw-flex dtw-items-center">
                  <DepositSettings />
                </SettingsPopover>
              </Tab.Panel>
              <Tab.Panel>
                <SettingsPopover className="dtw-flex dtw-items-center">
                  <WithdrawSettings />
                </SettingsPopover>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Tab.List>
        <Tab.Panels>
          <DepositTabPanel />
          <WithdrawTabPanel />
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
