import BigNumber from 'bignumber.js'
import { useEffect } from 'react'

import { useReceiveTokenInput } from 'core-kit/hooks/state'
import {
  useCompleteWithdrawSwapData,
  useCompleteWithdrawTrackedAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { formatUnits, isEqualAddress } from 'core-kit/utils'

export const useCompleteWithdrawQuote = () => {
  const [receiveAsset, updateReceiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  const { data: swapData, isFetching, isError } = useCompleteWithdrawSwapData()

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
