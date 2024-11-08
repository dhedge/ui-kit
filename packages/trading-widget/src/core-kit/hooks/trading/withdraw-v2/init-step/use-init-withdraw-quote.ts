import BigNumber from 'bignumber.js'
import { useEffect } from 'react'

import { usePoolTokenPrice } from 'core-kit/hooks/pool'
import {
  useReceiveTokenInput,
  useSendTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading/use-asset-price'
import { isNumeric } from 'core-kit/utils'

export const useInitWithdrawQuote = () => {
  const { chainId, address } = useTradingPanelPoolConfig()
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
    const sendValue = new BigNumber(sendToken.value).multipliedBy(
      sendTokenPrice,
    )
    const receiveTokenAmount = sendValue
      .dividedBy(receiveTokenPrice)
      .toFixed(receiveToken.decimals)

    updateReceiveToken({
      value: isNumeric(receiveTokenAmount) ? receiveTokenAmount : '',
    })
  }, [
    receiveToken.decimals,
    receiveTokenPrice,
    sendToken.value,
    sendTokenPrice,
    updateReceiveToken,
  ])
}
