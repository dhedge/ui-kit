import BigNumber from 'bignumber.js'

import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import { useUserTokenBalance } from 'core-kit/hooks/user'

import { formatBalance, formatToUsd } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useDepositBalance = () => {
  const { stablePrecision, defaultPrecision } = useConfigContextParams()
  const [{ symbol, address }] = useSendTokenInput()
  const balance = useUserTokenBalance({ symbol, address, watch: true })

  const { chainId } = useTradingPanelPoolConfig()
  const sendTokenPrice = useAssetPrice({ address, chainId }) ?? ''
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
