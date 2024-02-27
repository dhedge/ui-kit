import classNames from 'classnames'

import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'components/common'
import { Spinner, TransactionOverviewDisclosure } from 'components/common'
import { useTranslationContext } from 'providers/translation-provider'

import { THEME_TYPE } from 'types'

import { useDepositTransactionDisclosure } from './transaction-disclosure.hooks'

export const DepositTransactionOverviewDisclosure = () => {
  const t = useTranslationContext()
  const {
    projectedEarnings: { yearlyEarnings, dailyEarnings },
    slippageTooltipText,
    slippagePlaceholder,
    isMaxSlippageLoading,
    minReceive,
    themeType,
    allowanceRequired,
    tokenAllowance,
    sendTokenSymbol,
    entryFee,
    entryFeeTooltipText,
    minDeposit,
    lockTime,
  } = useDepositTransactionDisclosure()

  const staticItems: TransactionDisclosureItemProps[] = [
    {
      tooltipText: t.projectedDailyEarningsTooltip,
      label: t.dailyEarnings,
      value: dailyEarnings,
      emphasised: true,
    },
    {
      tooltipText: t.projectedYearlyEarningsTooltip,
      label: t.yearlyEarnings,
      value: yearlyEarnings,
      emphasised: true,
    },
  ]

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
              {slippagePlaceholder}%
            </span>
          </div>
        ),
      },
      {
        tooltipText: t.minReceiveAmount,
        label: t.minReceived,
        value: minReceive,
      },
    ]

    if (allowanceRequired) {
      items.push({
        tooltipText: t.amountToBeApproved.replace('{symbol}', sendTokenSymbol),
        label: t.tokenAllowance,
        value: tokenAllowance,
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

    return items
  }, [
    slippageTooltipText,
    t,
    isMaxSlippageLoading,
    slippagePlaceholder,
    minReceive,
    allowanceRequired,
    sendTokenSymbol,
    tokenAllowance,
    entryFeeTooltipText,
    entryFee,
    minDeposit,
  ])

  return (
    <TransactionOverviewDisclosure
      staticItems={staticItems}
      collapseItems={collapseItems}
      themeType={themeType}
    >
      <p className="dtw-py-1">
        {t.tokensLockTime.replace('{lockTime}', lockTime)}
      </p>
    </TransactionOverviewDisclosure>
  )
}
