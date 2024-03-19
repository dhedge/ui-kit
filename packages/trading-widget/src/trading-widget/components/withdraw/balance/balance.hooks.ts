import { usePoolTokenPrice } from '@dhedge/core-ui-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from '@dhedge/core-ui-kit/hooks/state'
import { useUserTokenBalance } from '@dhedge/core-ui-kit/hooks/user'
import BigNumber from 'bignumber.js'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useWithdrawBalance = () => {
  const { stablePrecision, defaultPrecision } = useConfigContextParams()
  const [{ symbol, address }] = useSendTokenInput()
  const balance = useUserTokenBalance({ symbol, address, watch: true })

  const { chainId } = useTradingPanelPoolConfig()
  const sendTokenPrice = usePoolTokenPrice({ address, chainId }) ?? ''
  const precision = symbol === 'USDC' ? stablePrecision : defaultPrecision

  return {
    formattedBalance: `${new BigNumber(balance)
      .precision(precision, BigNumber.ROUND_DOWN)
      .toString()} ${symbol}`,
    formattedPrice:
      +balance > 0 && sendTokenPrice
        ? `≈$${new BigNumber(balance)
            .multipliedBy(sendTokenPrice)
            .toPrecision(2, BigNumber.ROUND_DOWN)}`
        : null,
  }
}
