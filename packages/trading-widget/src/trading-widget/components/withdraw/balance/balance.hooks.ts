import BigNumber from 'bignumber.js'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

import { formatBalance, formatToUsd } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useWithdrawBalance = () => {
  const { stablePrecision, defaultPrecision } = useConfigContextParams()
  const [{ symbol, address }] = useSendTokenInput()
  const balance = useUserTokenBalance({ symbol, address })

  const { chainId } = useTradingPanelPoolConfig()
  const sendTokenPrice = usePoolTokenPrice({ address, chainId }) ?? ''
  const precision = symbol === 'USDC' ? stablePrecision : defaultPrecision

  return {
    formattedBalance: `${formatBalance(balance, precision)} ${symbol}`,
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
