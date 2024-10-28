import classNames from 'classnames'
import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'trading-widget/components/common'
import {
  Spinner,
  TransactionOverviewDisclosure,
} from 'trading-widget/components/common'

import { ExchangeRate } from 'trading-widget/components/widget/widget-meta'
import { useInitWithdrawTransactionDisclosure } from 'trading-widget/components/withdraw/init-step/meta/transaction-disclosure/transaction-disclosure.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const InitWithdrawTransactionOverviewDisclosure = () => {
  const t = useTranslationContext()
  const {
    slippageTooltipText,
    slippagePlaceholder,
    isMaxSlippageLoading,
    allowanceRequired,
    sendTokenSymbol,
    tokenAllowance,
    exitFee,
    minReceivedText,
    showMinReceivedText,
  } = useInitWithdrawTransactionDisclosure()

  const collapseItems = useMemo<TransactionDisclosureItemProps[]>(() => {
    const items: TransactionDisclosureItemProps[] = [
      {
        tooltipText: slippageTooltipText,
        label: t.maxSlippage,
        value: (
          <div className="dtw-flex dtw-gap-1">
            {isMaxSlippageLoading && (
              <Spinner
                type={THEME_TYPE.CUSTOM}
                className="dtw-stroke-[color:var(--panel-accent-from-color)] dtw-h-[var(--panel-icon-secondary-size)] sm:dtw-h-[var(--panel-icon-secondary-size-sm)] dtw-w-[var(--panel-icon-secondary-size)] sm:dtw-w-[var(--panel-icon-secondary-size-sm)]"
              />
            )}
            <span
              className={classNames({
                'dtw-text-[color:var(--panel-loading-content-color)]':
                  isMaxSlippageLoading,
              })}
            >
              {slippagePlaceholder}
            </span>
          </div>
        ),
      },
      { label: t.exitFee, value: exitFee, tooltipText: t.exitFeeExplanation },
    ]

    if (showMinReceivedText) {
      items.push({
        tooltipText: t.minReceiveAmount,
        label: t.minReceived,
        value: minReceivedText,
      })
    }

    if (allowanceRequired) {
      items.push({
        tooltipText: t.amountToBeApproved.replace('{symbol}', sendTokenSymbol),
        label: t.tokenAllowance,
        value: tokenAllowance,
      })
    }

    return items
  }, [
    slippageTooltipText,
    t.maxSlippage,
    t.exitFee,
    t.exitFeeExplanation,
    t.minReceiveAmount,
    t.minReceived,
    t.amountToBeApproved,
    t.tokenAllowance,
    isMaxSlippageLoading,
    slippagePlaceholder,
    exitFee,
    showMinReceivedText,
    allowanceRequired,
    minReceivedText,
    sendTokenSymbol,
    tokenAllowance,
  ])

  return (
    <TransactionOverviewDisclosure
      collapseItems={collapseItems}
      buttonItemChildren={<ExchangeRate />}
    />
  )
}
