import { BigNumber } from 'bignumber.js'

import { useUserTokenBalance } from 'core-kit/hooks/user'
import type { TradingToken } from 'core-kit/types'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export interface TokenSelectItemProps {
  token: TradingToken
  onSelect: (token: TradingToken) => void
  isActive?: boolean
}

export const useTokenSelectItem = ({
  token,
  onSelect,
}: TokenSelectItemProps) => {
  const balance = useUserTokenBalance({
    symbol: token.symbol,
    address: token.address,
  })
  const { defaultPrecision } = useConfigContextParams()
  const formattedBalance = new BigNumber(balance).toFixed(
    defaultPrecision,
    BigNumber.ROUND_DOWN,
  )

  const handleOptionSelect = () => {
    onSelect(token)
  }

  return {
    formattedBalance,
    onClick: handleOptionSelect,
  }
}
