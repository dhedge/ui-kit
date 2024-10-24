import { useMemo } from 'react'

import { AddressZero } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
} from 'core-kit/hooks/state'
import { useSwapsDataQuery } from 'core-kit/hooks/trading/use-swaps-data-query'
import {
  useCompleteWithdrawTrackedAssets,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useAccount } from 'core-kit/hooks/web3'
import { isEqualAddress } from 'core-kit/utils'

export const useCompleteWithdrawSwapData = () => {
  const { chainId } = useTradingPanelPoolConfig()
  const { account: walletAddress = AddressZero } = useAccount()
  const slippage = useAppliedWithdrawSlippage()

  const [receiveToken] = useReceiveTokenInput()
  const { data: assets = [] } = useCompleteWithdrawTrackedAssets()
  const swapDataRequired = useHasSwappableAssets()

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
    [assets, chainId, receiveToken.address, slippage, walletAddress],
  )

  return useSwapsDataQuery(swapDataAssets, {
    enabled: swapDataRequired,
  })
}
