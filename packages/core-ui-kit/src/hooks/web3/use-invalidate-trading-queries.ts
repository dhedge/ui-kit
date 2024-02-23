import type { QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

type ContractReadQueryKey = ['readContract', { functionName?: string }]
type ContractReadsQueryKey = [
  'readContracts',
  { contracts?: { functionName?: string }[] },
]

const tradingContractCalls = [
  'balanceOf',
  'getFundSummary',
  'getFundComposition',
]
const allowanceContractCalls = ['allowance']

const filterQueries = (
  queryKey: QueryKey,
  contractCalls: string[],
): boolean => {
  if (queryKey[0] === 'readContract') {
    if (
      contractCalls.includes(
        (queryKey as ContractReadQueryKey)?.[1]?.functionName ?? '',
      )
    ) {
      return true
    }
  }
  if (queryKey[0] === 'readContracts') {
    const contracts = (queryKey as ContractReadsQueryKey)[1]?.contracts
    if (
      contracts?.some(({ functionName }) =>
        contractCalls.includes(functionName ?? ''),
      )
    ) {
      return true
    }
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
