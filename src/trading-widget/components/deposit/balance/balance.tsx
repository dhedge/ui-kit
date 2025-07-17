import type { FC } from 'react'

import { Balance } from 'trading-widget/components/common'

import { useDepositBalance } from 'trading-widget/components/deposit/balance/balance.hooks'

export const DepositBalance: FC = () => {
  const { formattedBalance, formattedPrice } = useDepositBalance()

  return <Balance balance={formattedBalance} price={formattedPrice} />
}
