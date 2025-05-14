import type { QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import type {
  ContractReadQueryKey,
  ContractReadsQueryKey,
} from 'core-kit/types'

const tradingContractCalls = [
  'balanceOf',
  'getFundSummary',
  'getFundComposition',
  'withdrawalContracts',
  'getTrackedAssets',
  'getAssetPrice',
  'allowance',
]
const allowanceContractCalls = ['allowance']

const filterQueries = (
  queryKey: QueryKey,
  contractCalls: string[],
): boolean => {
  if (queryKey[0] === 'readContract') {
    return contractCalls.includes(
      (queryKey as ContractReadQueryKey)?.[1]?.functionName ?? '',
    )
  }
  if (queryKey[0] === 'readContracts') {
    const contracts = (queryKey as ContractReadsQueryKey)[1]?.contracts
    return !!contracts?.some(({ functionName }) =>
      contractCalls.includes(functionName ?? ''),
    )
  }

  return false
}

export const useInvalidateTradingQueries = () => {
  const queryClient = useQueryClient()

  const invalidateAllowanceQueries = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        filterQueries(queryKey, allowanceContractCalls),
    })
  }, [queryClient])

  const invalidateTradingQueries = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        filterQueries(queryKey, tradingContractCalls),
    })
  }, [queryClient])

  return { invalidateAllowanceQueries, invalidateTradingQueries }
}
