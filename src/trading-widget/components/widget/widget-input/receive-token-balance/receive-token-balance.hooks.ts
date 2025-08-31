import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

import { formatTokenBalance, isStableSymbol } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useReceiveTokenBalance = () => {
  const { stablePrecision, defaultPrecision } = useConfigContextParams()
  const [{ symbol, address }] = useReceiveTokenInput()
  const balance = useUserTokenBalance({ symbol, address, watch: true })

  return {
    formattedBalance: formatTokenBalance({
      balance,
      symbol,
      precision: isStableSymbol(symbol) ? stablePrecision : defaultPrecision,
      truncateSymbol: true,
    }),
    symbol,
  }
}
