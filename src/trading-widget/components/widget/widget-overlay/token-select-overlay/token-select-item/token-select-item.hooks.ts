import { BigNumber } from 'bignumber.js'

import { useUserTokenBalance } from 'core-kit/hooks/user'
import type { TradingToken } from 'core-kit/types'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export interface TokenSelectItemProps {
  token: TradingToken
  onSelect: (token: TradingToken) => void
  onClose: () => void
  isActive?: boolean
}

export const useTokenSelectItem = ({
  token,
  onSelect,
  isActive,
  onClose,
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
    if (isActive) {
      onClose()
      return
    }
    onSelect(token)
  }

  return {
    formattedBalance,
    onClick: handleOptionSelect,
  }
}
