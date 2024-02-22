import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'components/common'
import { TransactionOverviewDisclosure } from 'components/common'

export const DepositTransactionOverviewDisclosure = () => {
  const staticItems = useMemo<TransactionDisclosureItemProps[]>(
    () => [
      {
        tooltipText: 'Deposit static tooltip text',
        label: 'Deposit static label',
        value: 'Deposit static value',
        emphasised: true,
      },
    ],
    [],
  )

  const collapseItems = useMemo<TransactionDisclosureItemProps[]>(
    () => [
      {
        tooltipText: 'Deposit collapse tooltip text',
        label: 'Deposit collapse label',
        value: 'Deposit collapse value',
      },
    ],
    [],
  )

  return (
    <TransactionOverviewDisclosure
      staticItems={staticItems}
      collapseItems={collapseItems}
    >
      Deposit TransactionOverviewDisclosure Children
    </TransactionOverviewDisclosure>
  )
}
