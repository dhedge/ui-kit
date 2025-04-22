import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { ContractReadQueryKey } from 'core-kit/types'
import { LIMIT_ORDER_READ_FUNCTION_NAME } from 'limit-orders/constants'

const limitOrderReadCalls = [LIMIT_ORDER_READ_FUNCTION_NAME, 'allowance']

export const useInvalidateLimitOrderQuery = () => {
  const queryClient = useQueryClient()

  return useCallback(() => {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => {
        const functionName = (queryKey as ContractReadQueryKey)[1]?.functionName
        return (
          queryKey[0] === 'readContract' &&
          limitOrderReadCalls.some((fn) => fn === functionName)
        )
      },
    })
  }, [queryClient])
}
