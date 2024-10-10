import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'trading-widget/components/common'
import { TransactionOverviewDisclosure } from 'trading-widget/components/common'

import { ExchangeRate } from 'trading-widget/components/widget/widget-meta'
import { useWithdrawSwapTransactionDisclosure } from 'trading-widget/components/withdraw/swap-step/meta/transaction-disclosure/transaction-disclosure.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const WithdrawSwapTransactionOverviewDisclosure = () => {
  const t = useTranslationContext()
  const { slippageTooltipText, slippagePlaceholder, minReceive } =
    useWithdrawSwapTransactionDisclosure()

  const collapseItems = useMemo<TransactionDisclosureItemProps[]>(() => {
    const items: TransactionDisclosureItemProps[] = [
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
  ])

  return (
    <TransactionOverviewDisclosure
      collapseItems={collapseItems}
      buttonItemChildren={<ExchangeRate />}
    />
  )
}
