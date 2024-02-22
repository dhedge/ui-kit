import type { FC, PropsWithChildren } from 'react'

import { Meta } from 'components/common'

import { useComponentContext } from 'providers/component-provider'

import { DepositTransactionOverviewDisclosure } from './transaction-disclosure/transaction-disclosure'

export const DepositMeta: FC<PropsWithChildren> = ({ children }) => {
  const { DepositMetaInfo } = useComponentContext()

  return (
    <Meta>
      <DepositTransactionOverviewDisclosure />
      {DepositMetaInfo && <DepositMetaInfo />}
      {children}
    </Meta>
  )
}
