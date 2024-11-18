import 'styles/index.css'
import { TabGroup, TabPanels } from '@headlessui/react'
import type { FC } from 'react'

import { TABS } from 'trading-widget/constants/tab'

import { OVERLAY } from 'trading-widget/types'

import {
  FmpWithdrawalOverlay,
  HighSlippageOverlay,
  OverlaySwitch,
  PendingApprovalOverlay,
  PoolSelectOverlay,
  TermsOfUseOverlay,
  TokenSelectOverlay,
  TradingOverlay,
} from './widget-overlay'
import { WidgetSettings } from './widget-settings/widget-settings'
import { WidgetTabs } from './widget-tabs/widget-tabs'
import { useWidget } from './widget.hooks'
import { DepositTabPanel } from '../deposit'
import { WithdrawTabPanel } from '../withdraw'

export const Widget: FC = () => {
  const { type, onTabChange } = useWidget()

  return (
    <div className="trading-widget dtw-relative dtw-pt-3 dtw-bg-[var(--panel-background-color)] dtw-text-[color:var(--panel-content-color)] dtw-rounded-[var(--panel-radius)] dtw-overflow-hidden">
      <TabGroup selectedIndex={TABS.indexOf(type)} onChange={onTabChange}>
        <WidgetTabs>
          <WidgetSettings tradingType={type} />
        </WidgetTabs>
        <TabPanels>
          <DepositTabPanel />
          <WithdrawTabPanel />
        </TabPanels>
      </TabGroup>
      <OverlaySwitch>
        <TermsOfUseOverlay type={OVERLAY.TERMS_OF_USE} />
        <HighSlippageOverlay type={OVERLAY.HIGH_SLIPPAGE} />
        <FmpWithdrawalOverlay type={OVERLAY.FMP_WITHDRAWAL} />
        <TokenSelectOverlay type={OVERLAY.TOKEN_SELECT} searchQuery="" />
        <PoolSelectOverlay type={OVERLAY.POOL_SELECT} searchQuery="" />
        <TradingOverlay type={OVERLAY.TRADING} />
      </OverlaySwitch>
      <PendingApprovalOverlay />
    </div>
  )
}
