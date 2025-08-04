import { useReceiveTokenInput } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

import { formatBalance } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useReceiveTokenBalance = () => {
  const { stablePrecision, defaultPrecision } = useConfigContextParams()
  const [{ symbol, address }] = useReceiveTokenInput()
  const balance = useUserTokenBalance({ symbol, address, watch: true })

  const precision = symbol === 'USDC' ? stablePrecision : defaultPrecision

  return {
    formattedBalance: `${formatBalance(balance, precision)} ${symbol}`,
  }
}
