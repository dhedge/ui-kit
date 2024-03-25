import { useEffect } from 'react'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import { useReceiveTokenInput, useSendTokenInput } from 'core-kit/hooks/state'
import type { PoolConfig } from 'core-kit/types/config.types'

import { useAssetPrice } from '../use-asset-price'

const useSendToken = ({
  address,
  chainId,
}: Pick<PoolConfig, 'address' | 'chainId'>) => {
  const [data] = useSendTokenInput()
  const price = usePoolTokenPrice({ address, chainId }) ?? ''

  return {
    ...data,
    price,
  }
}

export const useWithdrawQuote = (
  poolConfig: Pick<PoolConfig, 'address' | 'chainId'>,
) => {
  const sendToken = useSendToken(poolConfig)

  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const receiveTokenPrice =
    useAssetPrice({
      address: receiveToken.address,
      chainId: poolConfig.chainId,
    }) ?? ''

  useEffect(() => {
    if (!sendToken.value || sendToken.value === '0') {
      updateReceiveToken({ value: '0' })
      return
    }

    const sendTokenPriceNumber = Number(sendToken.price)
    const receiveTokenPriceNumber = Number(receiveTokenPrice)
    const newReceiveAssetValue = receiveTokenPriceNumber
      ? (
          (Number(sendToken.value) * sendTokenPriceNumber) /
          receiveTokenPriceNumber
        ).toString()
      : '0'
    updateReceiveToken({ value: newReceiveAssetValue })
  }, [receiveTokenPrice, sendToken.price, sendToken.value, updateReceiveToken])
}
