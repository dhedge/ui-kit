import { Tab } from '@headlessui/react'
import type { FC, PropsWithChildren } from 'react'
export const Panel: FC<PropsWithChildren> = ({ children }) => (
  <Tab.Panel className="dtw-pt-[var(--panel-content-pt)] dtw-pb-[var(--panel-content-pb)] dtw-px-[var(--panel-content-px)] dtw-flex dtw-flex-col dtw-gap-[var(--panel-content-gap,var(--panel-gap))]">
    {children}
  </Tab.Panel>
)
