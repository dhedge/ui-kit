import type { FC } from 'react'

import { Balance } from 'trading-widget/components/common'

import { useInitWithdrawBalance } from 'trading-widget/components/withdraw/init-step/balance/init-withdraw-balance.hooks'

export const InitWithdrawBalance: FC = () => {
  const { formattedBalance, formattedPrice } = useInitWithdrawBalance()

  return <Balance balance={formattedBalance} price={formattedPrice} />
}
