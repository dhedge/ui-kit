import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'

import type { Address } from 'viem'

import { MULTI_CHAIN_SWAPPER_CONTRACT_ADDRESS } from 'core-kit/const'
import { useGetSwapData } from 'core-kit/hooks/state'
import type { SwapDataRequest, SwapDataResponse } from 'core-kit/types'

export const fetchSwapsData = async ({
  assets,
  getSwapData,
  signal,
}: {
  assets: Omit<SwapDataRequest, 'fromAddress'>[]
  getSwapData: ReturnType<typeof useGetSwapData>
  signal: AbortSignal
}): Promise<Record<Address, SwapDataResponse>> =>
  Promise.all(
    assets.map((variables) =>
      getSwapData({
        signal,
        variables: {
          ...variables,
          fromAddress: MULTI_CHAIN_SWAPPER_CONTRACT_ADDRESS,
        },
      }),
    ),
  ).then((data) =>
    assets.reduce(
      (acc, { sourceAddress }, i) => ({ ...acc, [sourceAddress]: data[i] }),
      {},
    ),
  )

export const useSwapsDataQuery = (
  assets: Omit<SwapDataRequest, 'fromAddress'>[],
  options?: Omit<
    UseQueryOptions<
      Record<Address, SwapDataResponse | null>,
      Error,
      Record<Address, SwapDataResponse | null>,
      [string, Omit<SwapDataRequest, 'fromAddress'>[]]
    >,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<Record<Address, SwapDataResponse | null>, Error> => {
  const getSwapData = useGetSwapData()

  return useQuery({
    queryKey: ['getSwapsData', assets],
    queryFn: async ({ signal, queryKey: [, assets] }) =>
      fetchSwapsData({ assets, getSwapData, signal }),
    ...options,
  })
}
