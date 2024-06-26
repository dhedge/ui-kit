import type { FC } from 'react'

import { Balance } from 'trading-widget/components/common'

import { useDepositBalance } from './balance.hooks'

export const DepositBalance: FC = () => {
  const { formattedBalance, formattedPrice } = useDepositBalance()

  return <Balance balance={formattedBalance} price={formattedPrice} />
}
