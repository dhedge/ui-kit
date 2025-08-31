import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'trading-widget/components/common'
import { TransactionOverviewDisclosure } from 'trading-widget/components/common'

import { ExchangeRate } from 'trading-widget/components/widget/widget-meta'
import { useCompleteWithdrawTransactionDisclosure } from 'trading-widget/components/withdraw/complete-step/meta/transaction-disclosure/transaction-disclosure.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const CompleteWithdrawTransactionOverviewDisclosure = () => {
  const t = useTranslationContext()
  const { slippageTooltipText, slippagePlaceholder, minReceive } =
    useCompleteWithdrawTransactionDisclosure()

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
        value: <span>{slippagePlaceholder}%</span>,
      },
      {
        tooltipText: t.minReceiveAmount,
        label: t.minReceived,
        value: minReceive,
      },
    ]

    return items
  }, [
    minReceive,
    slippagePlaceholder,
    slippageTooltipText,
    t.maxSlippage,
    t.minReceiveAmount,
    t.minReceived,
    t.exchangeRate,
    t.rate,
  ])

  return <TransactionOverviewDisclosure collapseItems={collapseItems} />
}
