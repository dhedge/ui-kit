import { useMemo } from 'react'

import type { TransactionDisclosureItemProps } from 'components/common'
import { TransactionOverviewDisclosure } from 'components/common'

export const WithdrawTransactionOverviewDisclosure = () => {
  const staticItems = useMemo<TransactionDisclosureItemProps[]>(
    () => [
      {
        tooltipText: 'Withdraw static tooltip text',
        label: 'Withdraw static label',
        value: 'Withdraw static value',
        emphasised: true,
      },
    ],
    [],
  )

  const collapseItems = useMemo<TransactionDisclosureItemProps[]>(
    () => [
      {
        tooltipText: 'Withdraw collapse tooltip text',
        label: 'Withdraw collapse label',
        value: 'Withdraw collapse value',
      },
    ],
    [],
  )

  return (
    <TransactionOverviewDisclosure
      staticItems={staticItems}
      collapseItems={collapseItems}
    >
      Withdraw TransactionOverviewDisclosure Children
    </TransactionOverviewDisclosure>
  )
}
