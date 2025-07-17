import { TabPanel } from '@headlessui/react'

import type { FC, PropsWithChildren } from 'react'

import { SettingsPopover } from 'trading-widget/components/common/layout/settings/settings-popover/settings-popover'

export const Settings: FC<PropsWithChildren> = ({ children }) => (
  <TabPanel>
    <SettingsPopover>{children}</SettingsPopover>
  </TabPanel>
)
