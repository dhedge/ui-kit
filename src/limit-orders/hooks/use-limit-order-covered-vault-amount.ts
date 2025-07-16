import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { DEFAULT_PRECISION } from 'core-kit/const'
import { useAccount, useBalance } from 'core-kit/hooks/web3'
import { formatNumberToLimitedDecimals } from 'core-kit/utils'
import { DEFAULT_SELL_PERCENTAGE } from 'limit-orders/constants'
import { useLimitOrderState } from 'limit-orders/hooks/state'

export const useLimitOrderCoveredVaultAmount = () => {
  const { account } = useAccount()
  const {
    vaultAddress,
    vaultChainId,
    form: { sellPercentage },
  } = useLimitOrderState()
  const { data: balance } = useBalance({
    address: account,
    token: vaultAddress,
    chainId: vaultChainId,
  })

  return useMemo(() => {
    const percentage = sellPercentage || DEFAULT_SELL_PERCENTAGE
    if (!balance) {
      return {
        raw: '0',
        formatted: '0',
        symbol: '',
      }
    }
    const raw = new BigNumber(balance.value)
      .times(percentage)
      .dividedBy(100)
      .toFixed(0, BigNumber.ROUND_DOWN)

    const formatted = formatNumberToLimitedDecimals(
      new BigNumber(raw).shiftedBy(-DEFAULT_PRECISION).toFixed(),
      2,
    )

    return {
      raw,
      formatted,
      symbol: balance.symbol,
    }
  }, [balance, sellPercentage])
}
