import { useCallback } from 'react'

import { AddressZero } from 'core-kit/const'
import { useGetSwapData } from 'core-kit/hooks/state'
import { fetchSwapsDataForAave } from 'core-kit/hooks/trading/use-swaps-data-query'
import { useAccount } from 'core-kit/hooks/web3'
import type {
  CalculateSwapDataParamsResponse,
  PoolConfig,
} from 'core-kit/types'

const dummyController = new AbortController()
const dummySignal = dummyController.signal

export const useFetchInitWithdrawAaveSwapData = ({
  chainId,
}: Pick<PoolConfig, 'chainId'>) => {
  const { account: walletAddress = AddressZero } = useAccount()
  const getSwapData = useGetSwapData()

  return useCallback(
    async ({
      swapParams,
      slippage,
    }: {
      swapParams: CalculateSwapDataParamsResponse | undefined
      slippage: number
    }) => {
      const assets = (swapParams?.srcData ?? []).map(({ asset, amount }) => {
        return {
          chainId,
          sourceAddress: asset,
          destinationAddress: swapParams?.dstData.asset ?? AddressZero,
          walletAddress,
          amount: amount.toString(),
          slippage: slippage.toString(),
        }
      })

      return fetchSwapsDataForAave({
        assets,
        getSwapData,
        signal: dummySignal,
      })
    },
    [chainId, getSwapData, walletAddress],
  )
}
