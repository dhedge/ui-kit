import type { FC } from 'react'

import { Balance } from 'trading-widget/components/common'

import { useSendTokenBalance } from './send-token-balance.hooks'

export const SendTokenBalance: FC = () => {
  const { formattedBalance } = useSendTokenBalance()

  return <Balance balance={formattedBalance} />
}
