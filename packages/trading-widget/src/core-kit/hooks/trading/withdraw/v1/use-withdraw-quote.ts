import { useEffect } from 'react'

import { usePoolFees, usePoolTokenPrice } from 'core-kit/hooks/pool'
import { useReceiveTokenInput, useSendTokenInput } from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading/use-asset-price'
import type { PoolConfig } from 'core-kit/types/config.types'

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
  const { exitFeeNumber } = usePoolFees({
    address: poolConfig.address,
    chainId: poolConfig.chainId,
  })
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
    // apply exit fee
    const sendTokenValueAfterExitFee =
      Number(sendToken.value) * (1 - exitFeeNumber / 100)

    const sendTokenPriceNumber = Number(sendToken.price)
    const receiveTokenPriceNumber = Number(receiveTokenPrice)
    const newReceiveAssetValue = receiveTokenPriceNumber
      ? (
          (sendTokenValueAfterExitFee * sendTokenPriceNumber) /
          receiveTokenPriceNumber
        ).toString()
      : '0'
    updateReceiveToken({ value: newReceiveAssetValue })
  }, [
    receiveTokenPrice,
    sendToken.price,
    sendToken.value,
    updateReceiveToken,
    exitFeeNumber,
  ])
}
