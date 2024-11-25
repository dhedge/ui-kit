import { useMemo } from 'react'

import { AddressZero, SWAP_QUOTE_REFRESH_INTERVAL_MS } from 'core-kit/const'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { useSwapsDataQuery } from 'core-kit/hooks/trading/use-swaps-data-query'
import { useAaveSwapParams } from 'core-kit/hooks/trading/withdraw-v2/init-step/use-aave-swap-params'
import { useAppliedWithdrawSlippage } from 'core-kit/hooks/trading/withdraw-v2/use-applied-withdraw-slippage'
import { useAccount } from 'core-kit/hooks/web3'
import { isZeroAddress } from 'core-kit/utils'

export const useInitWithdrawAaveSwapData = ({
  disabled,
}: {
  disabled: boolean
}) => {
  const { account: walletAddress = AddressZero } = useAccount()
  const { address, chainId } = useTradingPanelPoolConfig()
  const { data } = useAaveSwapParams({ address, chainId, disabled })

  const slippage = useAppliedWithdrawSlippage()

  const swapDataAssets = useMemo(
    () =>
      (data?.srcData ?? []).map(({ asset, amount }) => {
        return {
          chainId,
          sourceAddress: asset,
          destinationAddress: data?.dstData.asset ?? AddressZero,
          walletAddress,
          amount: amount.toString(),
          slippage: slippage.toString(),
        }
      }),
    [chainId, data?.dstData.asset, data?.srcData, slippage, walletAddress],
  )

  return useSwapsDataQuery(swapDataAssets, {
    enabled: !isZeroAddress(data?.dstData.asset ?? AddressZero),
    refetchInterval: SWAP_QUOTE_REFRESH_INTERVAL_MS,
  })
}
