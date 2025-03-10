import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { ContractReadQueryKey } from 'core-kit/types'
import { LIMIT_ORDER_READ_FUNCTION_NAME } from 'limit-orders/constants'

export const useInvalidateLimitOrderQuery = () => {
  const queryClient = useQueryClient()

  return useCallback(() => {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => {
        return (
          queryKey[0] === 'readContract' &&
          (queryKey as ContractReadQueryKey)[1]?.functionName ===
            LIMIT_ORDER_READ_FUNCTION_NAME
        )
      },
    })
  }, [queryClient])
}
