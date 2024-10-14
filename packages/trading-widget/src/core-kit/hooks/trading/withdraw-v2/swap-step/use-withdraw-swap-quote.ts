import BigNumber from 'bignumber.js'
import { useEffect } from 'react'

import { useReceiveTokenInput } from 'core-kit/hooks/state'
import {
  useWithdrawSwapData,
  useWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { formatUnits, isEqualAddress } from 'core-kit/utils'

export const useWithdrawSwapQuote = () => {
  const [receiveAsset, updateReceiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useWithdrawTrackedAssets()
  const { data: swapData, isFetching, isError } = useWithdrawSwapData()

  useEffect(() => {
    updateReceiveToken({ isLoading: isFetching })
  }, [isFetching, updateReceiveToken])

  useEffect(() => {
    if (assets.length === 0 || isFetching || isError) {
      return
    }
    const totalReceivedValue = assets.reduce((acc, asset) => {
      if (isEqualAddress(asset.address, receiveAsset.address)) {
        return acc.plus(asset.rawBalance.toString())
      }

      const swapAmount = swapData?.[asset.address]?.destinationAmount ?? '0'
      return acc.plus(swapAmount)
    }, new BigNumber(0))

    updateReceiveToken({
      value: formatUnits(
        BigInt(totalReceivedValue.toFixed()),
        receiveAsset.decimals,
      ),
    })
  }, [
    assets,
    isError,
    isFetching,
    receiveAsset.address,
    receiveAsset.decimals,
    swapData,
    updateReceiveToken,
  ])
}