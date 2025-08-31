import classNames from 'classnames'

import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'trading-widget/components/common'
import {
  Spinner,
  TransactionOverviewDisclosure,
} from 'trading-widget/components/common'
import { useDepositTransactionDisclosure } from 'trading-widget/components/deposit/meta/transaction-disclosure/transaction-disclosure.hooks'
import { ExchangeRate } from 'trading-widget/components/widget/widget-meta'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const DepositTransactionOverviewDisclosure = () => {
  const t = useTranslationContext()
  const {
    projectedEarnings: { yearlyEarnings, dailyEarnings, showEarnings },
    slippageTooltipText,
    slippagePlaceholder,
    isMaxSlippageLoading,
    minReceive,
    themeType,
    entryFee,
    entryFeeTooltipText,
    minDeposit,
    lockTime,
    showMinimumReceivedAmount,
  } = useDepositTransactionDisclosure()

  const staticItems: TransactionDisclosureItemProps[] = showEarnings
    ? [
        {
          tooltipText: t.projectedYearlyEarningsTooltip,
          label: t.yearlyEarnings,
          value: yearlyEarnings,
          emphasised: true,
        },
        {
          tooltipText: t.projectedDailyEarningsTooltip,
          label: t.dailyEarnings,
          value: dailyEarnings,
          emphasised: true,
        },
      ]
    : []

  const collapseItems = useMemo<TransactionDisclosureItemProps[]>(() => {
    const items: TransactionDisclosureItemProps[] = [
      {
        tooltipText: t.exchangeRate,
        label: t.rate,
        value: <ExchangeRate />,
      },
      {
        tooltipText: slippageTooltipText,
        label: t.maxSlippage,
        value: (
          <div className="dtw-flex dtw-gap-1">
            {isMaxSlippageLoading && (
              <Spinner className="dtw-stroke-[color:var(--panel-accent-from-color)] dtw-h-[var(--panel-icon-secondary-size)] sm:dtw-h-[var(--panel-icon-secondary-size-sm)] dtw-w-[var(--panel-icon-secondary-size)] sm:dtw-w-[var(--panel-icon-secondary-size-sm)]" />
            )}
            <span
              className={classNames({
                'dtw-text-[color:var(--panel-loading-content-color)]':
                  isMaxSlippageLoading,
              })}
            >
              {slippagePlaceholder}%
            </span>
          </div>
        ),
      },
    ]

    if (showMinimumReceivedAmount) {
      items.push({
        tooltipText: t.minReceiveAmount,
        label: t.minReceived,
        value: minReceive,
      })
    }

    items.push({
      tooltipText: entryFeeTooltipText,
      label: t.entryFee,
      value: entryFee,
    })

    if (minDeposit) {
      items.push({
        tooltipText: t.minDepositUsd,
        label: t.minDeposit,
        value: minDeposit,
      })
    }

    items.push({
      tooltipText: t.tokensLockTime.replace('{lockTime}', lockTime),
      label: t.cooldown,
      value: lockTime,
    })

    return items
  }, [
    slippageTooltipText,
    t.maxSlippage,
    t.entryFee,
    t.minReceiveAmount,
    t.minReceived,
    t.minDepositUsd,
    t.minDeposit,
    t.exchangeRate,
    t.rate,
    t.tokensLockTime,
    t.cooldown,
    isMaxSlippageLoading,
    slippagePlaceholder,
    showMinimumReceivedAmount,
    entryFeeTooltipText,
    entryFee,
    minDeposit,
    minReceive,
    lockTime,
  ])

  return (
    <TransactionOverviewDisclosure
      staticItems={staticItems}
      collapseItems={collapseItems}
      themeType={themeType}
    />
  )
}
