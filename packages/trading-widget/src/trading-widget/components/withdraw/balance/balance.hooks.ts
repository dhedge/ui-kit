import BigNumber from 'bignumber.js'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

import { formatToUsd } from 'core-kit/utils'
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
        ? `≈${formatToUsd({
            value: new BigNumber(balance)
              .multipliedBy(sendTokenPrice)
              .toNumber(),
          })}`
        : null,
  }
}
