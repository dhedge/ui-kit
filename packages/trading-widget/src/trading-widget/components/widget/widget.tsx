import 'styles/index.css'
import { Tab } from '@headlessui/react'
import type { FC } from 'react'

import { TABS } from 'trading-widget/constants/tab'

import { OVERLAY } from 'trading-widget/types'

import {
  FmedWithdrawalOverlay,
  HighSlippageOverlay,
  OverlaySwitch,
  PendingApprovalOverlay,
  TermsOfUseOverlay,
} from './widget-overlay'
import { WidgetSettings } from './widget-settings/widget-settings'
import { WidgetTabs } from './widget-tabs/widget-tabs'
import { useWidget } from './widget.hooks'
import { DepositTabPanel } from '../deposit'
import { WithdrawTabPanel } from '../withdraw'

export const Widget: FC = () => {
  const { type, onTabChange } = useWidget()

  return (
    <div className="dtw-relative dtw-pt-3">
      <Tab.Group selectedIndex={TABS.indexOf(type)} onChange={onTabChange}>
        <WidgetTabs>
          <WidgetSettings tradingType={type} />
        </WidgetTabs>
        <Tab.Panels>
          <DepositTabPanel />
          <WithdrawTabPanel />
        </Tab.Panels>
      </Tab.Group>
      <OverlaySwitch>
        <TermsOfUseOverlay type={OVERLAY.TERMS_OF_USE} />
        <HighSlippageOverlay type={OVERLAY.HIGH_SLIPPAGE} />
        <FmedWithdrawalOverlay type={OVERLAY.FMED_WITHDRAWAL} />
      </OverlaySwitch>
      <PendingApprovalOverlay />
    </div>
  )
}
