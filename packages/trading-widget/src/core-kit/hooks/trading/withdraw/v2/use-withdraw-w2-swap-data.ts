import { useMemo } from 'react'

import { AddressZero } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSwapsDataQuery } from 'core-kit/hooks/trading/use-swaps-data-query'
import { useWithdrawV2TrackedAssets } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-v2-tracked-assets'
import { useAccount } from 'core-kit/hooks/web3'
import { isEqualAddress } from 'core-kit/utils'

export const useWithdrawW2SwapData = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const { account: walletAddress = AddressZero } = useAccount()

  const [receiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useWithdrawV2TrackedAssets()
  const swapDataRequired =
    assets.length > 0 &&
    !isEqualAddress(assets[0]?.address, receiveToken?.address)

  const swapDataAssets = useMemo(
    () =>
      assets.map(({ address, balance }) => ({
        chainId,
        sourceAddress: address,
        destinationAddress: receiveToken.address,
        walletAddress,
        amount: balance.toString(),
        slippage: '1',
      })),
    [assets, chainId, walletAddress, receiveToken.address],
  )

  return useSwapsDataQuery(swapDataAssets, {
    enabled: swapDataRequired,
  })
}
