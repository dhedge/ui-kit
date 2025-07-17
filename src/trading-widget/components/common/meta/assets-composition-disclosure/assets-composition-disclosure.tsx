import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const AssetsCompositionTable: FC<PropsWithChildren> = ({ children }) => (
  <table
    className="dtw-min-w-full dtw-border-separate"
    style={{ borderSpacing: '0px 0.25rem' }}
  >
    <tbody>{children}</tbody>
  </table>
)

export const AssetsCompositionDisclosure: FC<PropsWithChildren> = ({
  children,
}) => {
  const t = useTranslationContext()
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton className="dtw-px-1.5 dtw-w-[100px] dtw-flex dtw-justify-between dtw-rounded-[var(--panel-radius-secondary,var(--panel-radius))] hover:dtw-bg-[var(--panel-meta-hover-bg,var(--panel-neutral-color))] focus:dtw-outline-none">
            {open ? t.hide : t.showAll}
            <ChevronDownIcon
              className={classNames(
                'dtw-text-[color:var(--panel-icon-color,var(--panel-content-color))] !dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] !dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]',
                { 'dtw-rotate-180 dtw-transform': open },
              )}
            />
          </DisclosureButton>
          <Transition show={open}>
            <DisclosurePanel className="dtw-mt-1 dtw-transition dtw-transform dtw-duration-100 dtw-ease-out data-[closed]:opacity-0 data-[closed]:-dtw-translate-y-2.5 dtw-static dtw-rounded-[var(--panel-radius-secondary,var(--panel-radius))] dtw-flex dtw-flex-col dtw-gap-1">
              {children}
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
