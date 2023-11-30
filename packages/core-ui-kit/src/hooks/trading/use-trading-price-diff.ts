import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { usePoolTokenPrice } from 'hooks/pool'
import { useTradingPanelPoolConfig } from 'hooks/state'
import type { Address } from 'types/web3.types'
import { getConventionalTokenPriceDecimals } from 'utils'

import { useAssetPrice } from './use-asset-price'

interface UseTradingPriceDiffVariables {
  sendAssetAddress: Address
  sendAssetValue: string
  receiveAssetValue: string
}

export const useTradingPriceDiff = ({
  sendAssetAddress,
  sendAssetValue,
  receiveAssetValue,
}: UseTradingPriceDiffVariables) => {
  const { address, chainId } = useTradingPanelPoolConfig()
  const sendTokenPrice = useAssetPrice({
    address: sendAssetAddress,
    chainId,
  })
  const poolTokenPrice = usePoolTokenPrice({ address, chainId })

  return useMemo(() => {
    const sendValue = Number(sendAssetValue || '0')
    const receiveValue = Number(receiveAssetValue || '0')

    const sendAmount = new BigNumber(sendValue).times(sendTokenPrice ?? '0')
    const receiveAmount = new BigNumber(receiveValue).times(
      poolTokenPrice ?? '0',
    )

    if (sendAmount.isZero() || receiveAmount.isZero()) {
      return 0
    }

    const canBeCompared = sendAmount
      .decimalPlaces(getConventionalTokenPriceDecimals(sendValue))
      .comparedTo(
        receiveAmount.decimalPlaces(
          getConventionalTokenPriceDecimals(receiveValue),
        ),
      )

    if (canBeCompared) {
      return sendAmount.isGreaterThan(0)
        ? receiveAmount
            .dividedBy(sendAmount)
            .minus(1)
            .times(100)
            .decimalPlaces(2, BigNumber.ROUND_DOWN)
            .toNumber()
        : 0
    }

    return 0
  }, [sendTokenPrice, poolTokenPrice, sendAssetValue, receiveAssetValue])
}
