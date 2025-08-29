import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'

import type { TransactionDisclosureItemProps } from 'trading-widget/components/common/meta/transaction-disclosure/transaction-disclosure-item/transaction-disclosure-item'
import { TransactionDisclosureItem } from 'trading-widget/components/common/meta/transaction-disclosure/transaction-disclosure-item/transaction-disclosure-item'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'
import type { ThemeType } from 'trading-widget/types'

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
            <DisclosureButton className="dtw-p-0 dtw-flex dtw-w-full dtw-justify-between dtw-rounded-[var(--panel-radius-secondary,var(--panel-radius))] hover:dtw-bg-[var(--panel-meta-hover-bg,var(--panel-neutral-color))] focus:dtw-outline-none">
              <TransactionDisclosureItem
                tooltipText={t.fullReceiveDetails}
                label={t.tradeDetails}
                value=""
                type={themeType}
                emphasised
              >
                {buttonItemChildren}
                <ChevronDownIcon
                  className={classNames(
                    'dtw-text-[color:var(--panel-icon-color,var(--panel-content-color))] !dtw-h-[var(--panel-input-token-icon-size,var(--panel-icon-size))] !dtw-w-[var(--panel-input-token-icon-size,var(--panel-icon-size))] sm:dtw-w-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))] sm:dtw-h-[var(--panel-input-token-icon-size-sm,var(--panel-icon-size-sm))]',
                    { 'dtw-rotate-180 dtw-transform': open },
                  )}
                />
              </TransactionDisclosureItem>
            </DisclosureButton>
            <Transition show={open}>
              <DisclosurePanel className="dtw-transition dtw-transform dtw-duration-100 dtw-ease-out data-[closed]:opacity-0 data-[closed]:-dtw-translate-y-2.5 dtw-static dtw-text-[length:var(--panel-label-font-size,var(--panel-font-size-xs))] dtw-leading-[var(--panel-label-line-height,var(--panel-line-height-xs))] dtw-text-[color:var(--panel-secondary-content-color)] dtw-font-[var(--panel-meta-font-weight,var(--panel-font-weight-light))] dtw-rounded-[var(--panel-radius-secondary,var(--panel-radius))] dtw-flex dtw-flex-col dtw-gap-1">
                {collapseItems?.map((props) => (
                  <TransactionDisclosureItem key={props.label} {...props} />
                ))}
                {children}
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}
