import { useMemo } from 'react'

import { AddressZero } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSwapsDataQuery } from 'core-kit/hooks/trading/use-swaps-data-query'
import { useTrackedAssets } from 'core-kit/hooks/trading/withdraw/v2/swap-step/use-tracked-assets'
import { useWithdrawSlippage } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-slippage'
import { useAccount } from 'core-kit/hooks/web3'
import { isEqualAddress } from 'core-kit/utils'

export const useSwapData = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const { account: walletAddress = AddressZero } = useAccount()
  const slippage = useWithdrawSlippage()

  const [receiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useTrackedAssets()
  const swapDataRequired =
    assets.length > 0 &&
    !assets.every(({ address }) =>
      isEqualAddress(address, receiveToken.address),
    )

  const swapDataAssets = useMemo(
    () =>
      assets
        .filter(({ address }) => !isEqualAddress(address, receiveToken.address))
        .map(({ address, rawBalance }) => ({
          chainId,
          sourceAddress: address,
          destinationAddress: receiveToken.address,
          walletAddress,
          amount: rawBalance.toString(),
          slippage: slippage.toString(),
        })),
    [assets, chainId, receiveToken.address, walletAddress],
  )

  return useSwapsDataQuery(swapDataAssets, {
    enabled: swapDataRequired,
  })
}
