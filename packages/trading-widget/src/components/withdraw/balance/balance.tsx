import type { FC } from 'react'

import { Balance } from 'components/common'

import { useWithdrawBalance } from './balance.hooks'

export const WithdrawBalance: FC = () => {
  const { formattedBalance, formattedPrice } = useWithdrawBalance()

  return <Balance balance={formattedBalance} price={formattedPrice} />
}
