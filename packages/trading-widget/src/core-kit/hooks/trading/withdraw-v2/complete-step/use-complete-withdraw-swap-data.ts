import { useMemo } from 'react'

import { AddressZero, SWAP_QUOTE_REFRESH_INTERVAL_MS } from 'core-kit/const'
import {
  useReceiveTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useSwapsDataQuery } from 'core-kit/hooks/trading/use-swaps-data-query'
import {
  useCompleteWithdrawTrackedAssets,
  useHasSwappableAssets,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useAccount } from 'core-kit/hooks/web3'
import { isEqualAddress } from 'core-kit/utils'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useCompleteWithdrawSwapData = () => {
  const { defaultSwapTransactionSlippage } = useConfigContextParams()
  const { chainId } = useTradingPanelPoolConfig()
  const { account: walletAddress = AddressZero } = useAccount()

  const [{ slippage }] = useTradingPanelSettings()

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
          slippage: (slippage === 'auto'
            ? defaultSwapTransactionSlippage
            : slippage
          ).toString(),
        })),
    [
      assets,
      chainId,
      defaultSwapTransactionSlippage,
      receiveToken.address,
      slippage,
      walletAddress,
    ],
  )

  return useSwapsDataQuery(swapDataAssets, {
    enabled: swapDataRequired,
    refetchInterval: SWAP_QUOTE_REFRESH_INTERVAL_MS,
  })
}
