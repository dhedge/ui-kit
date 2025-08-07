import { useSendTokenInput } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

import { formatBalance } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useSendTokenBalance = () => {
  const { stablePrecision, defaultPrecision } = useConfigContextParams()
  const [{ symbol, address }] = useSendTokenInput()
  const balance = useUserTokenBalance({ symbol, address, watch: true })

  const precision = symbol === 'USDC' ? stablePrecision : defaultPrecision

  return {
    formattedBalance: `${formatBalance(balance, precision)} ${symbol}`,
  }
}
