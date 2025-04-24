import BigNumber from 'bignumber.js'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import { useSendTokenInput } from 'core-kit/hooks/state'
import { useUserTokenBalance } from 'core-kit/hooks/user'

import { formatBalance, formatToUsd } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useInitWithdrawBalance = () => {
  const { stablePrecision, defaultPrecision } = useConfigContextParams()
  const [{ symbol, address }] = useSendTokenInput()
  const balance = useUserTokenBalance({ symbol, address })

  const sendTokenPrice = usePoolTokenPrice({ address }) ?? ''
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
