import type { FC } from 'react'

import { Balance } from 'trading-widget/components/common'

import { useReceiveTokenBalance } from './receive-token-balance.hooks'

export const ReceiveTokenBalance: FC = () => {
  const { formattedBalance } = useReceiveTokenBalance()

  return <Balance balance={formattedBalance} />
}
