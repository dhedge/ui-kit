import classNames from 'classnames'
import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'trading-widget/components/common'
import {
  Spinner,
  TransactionOverviewDisclosure,
} from 'trading-widget/components/common'

import { ExchangeRate } from 'trading-widget/components/widget/widget-meta'
import { useWithdrawUnrollTransactionDisclosure } from 'trading-widget/components/withdraw/unroll-step/meta/transaction-disclosure/transaction-disclosure.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { THEME_TYPE } from 'trading-widget/types'

export const WithdrawUnrollTransactionOverviewDisclosure = () => {
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
  } = useWithdrawUnrollTransactionDisclosure()

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
      {
        tooltipText: t.minReceiveAmount,
        label: t.minReceived,
        value: minReceivedText,
      },
      { label: t.exitFee, value: exitFee, tooltipText: t.exitFeeExplanation },
    ]

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
    t.minReceiveAmount,
    t.minReceived,
    t.exitFee,
    t.exitFeeExplanation,
    t.amountToBeApproved,
    t.tokenAllowance,
    isMaxSlippageLoading,
    slippagePlaceholder,
    minReceivedText,
    exitFee,
    allowanceRequired,
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
