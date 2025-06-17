import BigNumber from 'bignumber.js'
import { useEffect } from 'react'

import { usePoolFees, usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading/use-asset-price'
import { isNumeric } from 'core-kit/utils'

export const useInitWithdrawQuote = () => {
  const { chainId, address } = useTradingPanelPoolConfig()
  const { exitFeeNumber } = usePoolFees({
    address,
    chainId,
  })
  const [sendToken] = useSendTokenInput()
  const [receiveToken, updateReceiveToken] = useReceiveTokenInput()
  const sendTokenPrice = usePoolTokenPrice({ address, chainId })
  const receiveTokenPrice = useAssetPrice({
    address: receiveToken.address,
    chainId,
  })

  useEffect(() => {
    if (!sendToken.value || sendToken.value === '0') {
      updateReceiveToken({ value: '' })
      return
    }
    const sendValue = new BigNumber(sendToken.value)
      .times(sendTokenPrice)
      .times(1 - exitFeeNumber / 100)
    const receiveTokenAmount = sendValue
      .dividedBy(receiveTokenPrice)
      .toFixed(receiveToken.decimals)

    updateReceiveToken({
      value: isNumeric(receiveTokenAmount) ? receiveTokenAmount : '',
    })
  }, [
    exitFeeNumber,
    receiveToken.decimals,
    receiveTokenPrice,
    sendToken.value,
    sendTokenPrice,
    updateReceiveToken,
  ])
}
