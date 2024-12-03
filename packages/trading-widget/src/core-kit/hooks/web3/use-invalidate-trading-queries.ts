import type { QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { QUERY_KEYS } from 'core-kit/const'

type ContractReadQueryKey = ['readContract', { functionName?: string }]
type ContractReadsQueryKey = [
  'readContracts',
  { contracts?: { functionName?: string }[] },
]

const tradingContractCalls = [
  'balanceOf',
  'getFundSummary',
  'getFundComposition',
  'withdrawalContracts',
  'getTrackedAssets',
  'getAssetPrice',
]
const allowanceContractCalls = ['allowance']
const customQueries = [QUERY_KEYS.SYNTHETIX_ORACLES_UPDATE]

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

  return customQueries.some((key) => key === queryKey[0])
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
