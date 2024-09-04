import { type UseQueryOptions, useQuery } from '@tanstack/react-query'

import { MULTI_CHAIN_SWAPPER_CONTRACT_ADDRESS } from 'core-kit/const'
import { useGetSwapData } from 'core-kit/hooks/state'
import type { SwapDataRequest, SwapDataResponse } from 'core-kit/types'

export const useSwapDataQuery = (
  variables: Omit<SwapDataRequest, 'fromAddress'>,
  options?: Omit<
    UseQueryOptions<
      SwapDataResponse | null,
      Error,
      SwapDataResponse | null,
      [string, SwapDataRequest]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const getSwapData = useGetSwapData()

  return useQuery({
    queryKey: [
      'getSwapData',
      { ...variables, fromAddress: MULTI_CHAIN_SWAPPER_CONTRACT_ADDRESS },
    ],
    queryFn: async ({ signal, queryKey: [, variables] }) =>
      getSwapData({ signal, variables }),
    ...options,
  })
}
