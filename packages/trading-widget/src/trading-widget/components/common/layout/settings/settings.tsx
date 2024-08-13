import { TabPanel } from '@headlessui/react'

import type { FC, PropsWithChildren } from 'react'

import { SettingsPopover } from './settings-popover/settings-popover'

export const Settings: FC<PropsWithChildren> = ({ children }) => (
  <TabPanel>
    <SettingsPopover>{children}</SettingsPopover>
  </TabPanel>
)
