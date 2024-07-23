import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'
import type { ThemeType } from 'trading-widget/types'

import type { TransactionDisclosureItemProps } from './transaction-disclosure-item/transaction-disclosure-item'
import { TransactionDisclosureItem } from './transaction-disclosure-item/transaction-disclosure-item'

interface TransactionOverviewDisclosureProps {
  buttonItemChildren?: TransactionDisclosureItemProps['children']
  staticItems?: TransactionDisclosureItemProps[]
  collapseItems?: TransactionDisclosureItemProps[]
  themeType?: ThemeType
}

export const TransactionOverviewDisclosure: FC<
  PropsWithChildren<TransactionOverviewDisclosureProps>
> = ({
  children,
  staticItems,
  collapseItems,
  themeType = THEME_TYPE.DEFAULT,
  buttonItemChildren,
}) => {
  const t = useTranslationContext()

  return (
    <div className="dtw-w-full dtw-flex dtw-flex-col dtw-gap-1">
      <Disclosure>
        {({ open }) => (
          <>
            {staticItems?.map((props) => (
              <TransactionDisclosureItem key={props.label} {...props} />
            ))}
            <Disclosure.Button className="dtw-p-0 dtw-flex dtw-w-full dtw-justify-between dtw-rounded-[var(--panel-radius-secondary,var(--panel-radius))] hover:dtw-bg-[var(--panel-meta-hover-bg,var(--panel-neutral-color))] focus:dtw-outline-none">
              <TransactionDisclosureItem
                tooltipText={t.fullReceiveDetails}
                label={t.tradeDetails}
                value=""
                type={themeType}
              >
                {buttonItemChildren}
                <ChevronDownIcon
                  className={classNames(
                    'dtw-text-[color:var(--panel-icon-color,var(--panel-content-color))] !dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] !dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]',
                    { 'dtw-rotate-180 dtw-transform': open },
                  )}
                />
              </TransactionDisclosureItem>
            </Disclosure.Button>
            <Transition
              show={open}
              enter="dtw-transition dtw-duration-100 dtw-ease-out"
              enterFrom="dtw-transform dtw-scale-95 dtw-opacity-0"
              enterTo="dtw-transform dtw-scale-100 dtw-opacity-100"
              leave="dtw-transition dtw-duration-75 dtw-ease-out"
              leaveFrom="dtw-transform dtw-scale-100 dtw-opacity-100"
              leaveTo="dtw-transform dtw-scale-95 dtw-opacity-0"
            >
              <Disclosure.Panel className="dtw-static dtw-text-[length:var(--panel-label-font-size,var(--panel-font-size-xs))] dtw-leading-[var(--panel-label-line-height,var(--panel-line-height-xs))] dtw-text-[color:var(--panel-secondary-content-color)] dtw-font-[var(--panel-meta-font-weight,var(--panel-font-weight-light))] dtw-rounded-[var(--panel-radius-secondary,var(--panel-radius))] dtw-flex dtw-flex-col dtw-gap-1">
                {collapseItems?.map((props) => (
                  <TransactionDisclosureItem key={props.label} {...props} />
                ))}
                {children}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}
