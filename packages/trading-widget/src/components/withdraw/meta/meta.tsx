import type { FC, PropsWithChildren } from 'react'

import { Meta } from 'components/common'

import { useComponentContext } from 'providers/component-provider'

import { WithdrawTransactionOverviewDisclosure } from './transaction-disclosure/transaction-disclosure'

export const WithdrawMeta: FC<PropsWithChildren> = ({ children }) => {
  const { WithdrawMetaInfo } = useComponentContext()

  return (
    <Meta>
      <WithdrawTransactionOverviewDisclosure />
      {WithdrawMetaInfo && <WithdrawMetaInfo />}
      {children}
    </Meta>
  )
}
