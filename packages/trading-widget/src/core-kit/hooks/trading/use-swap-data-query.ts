import { type UseQueryOptions, useQuery } from '@tanstack/react-query'

import { useGetSwapData } from 'core-kit/hooks/state'
import type { SwapDataRequest, SwapDataResponse } from 'core-kit/types'

export const useSwapDataQuery = (
  variables: SwapDataRequest,
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
    queryKey: ['getSwapData', variables],
    queryFn: async ({ signal, queryKey: [, variables] }) =>
      getSwapData({ signal, variables }),
    ...options,
  })
}
