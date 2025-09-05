import { type UseQueryOptions, useQuery } from '@tanstack/react-query'

import type { Address } from 'viem'

import { useGetSwapData, useTradingPanelState } from 'core-kit/hooks/state'
import type { SwapDataRequest, SwapDataResponse } from 'core-kit/types'
import { buildSwapDataKeyForAave } from 'core-kit/utils'
import type {
  AssetWithoutFromAddress,
  SwapsDataMap,
} from 'core-kit/utils/swap-data'
import { fetchSwapsDataWithKey } from 'core-kit/utils/swap-data'

interface FetchSwapsDataParams {
  assets: AssetWithoutFromAddress[]
  getSwapData: ReturnType<typeof useGetSwapData>
  signal: AbortSignal
}

/**
 * Aave-specific variant: during Aave swaps it is possible to have two entries
 * with the same source asset and the same destination asset but different amounts.
 * To avoid key collisions it includes the amount.
 */
export const fetchSwapsDataForAave = async ({
  assets,
  getSwapData,
  signal,
}: FetchSwapsDataParams): Promise<SwapsDataMap<string>> =>
  fetchSwapsDataWithKey<string>({
    assets,
    getSwapData,
    signal,
    buildKey: ({ sourceAddress, amount }) =>
      buildSwapDataKeyForAave({ sourceAddress, amount }),
  })

export const fetchSwapsData = async ({
  assets,
  getSwapData,
  signal,
}: FetchSwapsDataParams): Promise<SwapsDataMap<Address>> =>
  fetchSwapsDataWithKey<Address>({
    assets,
    getSwapData,
    signal,
    buildKey: ({ sourceAddress }) => sourceAddress,
  })

export const useSwapsDataQuery = (
  assets: Omit<SwapDataRequest, 'fromAddress'>[],
  options?: Omit<
    UseQueryOptions<
      Record<Address, SwapDataResponse | null>,
      Error,
      Record<Address, SwapDataResponse | null>,
      [string, Omit<SwapDataRequest, 'fromAddress'>[], string[]]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const getSwapData = useGetSwapData()
  const {
    settings: { selectedAggregators },
  } = useTradingPanelState()

  return useQuery({
    queryKey: ['getSwapsData', assets, selectedAggregators],
    queryFn: async ({ signal, queryKey: [, assets] }) =>
      fetchSwapsData({ assets, getSwapData, signal }),
    ...options,
  })
}
