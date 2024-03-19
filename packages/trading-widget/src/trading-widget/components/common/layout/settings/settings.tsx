import { Tab } from '@headlessui/react'

import type { FC, PropsWithChildren } from 'react'

import { SettingsPopover } from './settings-popover/settings-popover'

export const Settings: FC<PropsWithChildren> = ({ children }) => (
  <Tab.Panel>
    <SettingsPopover>{children}</SettingsPopover>
  </Tab.Panel>
)
