import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { usePublicClient } from 'wagmi'
import type { UseReadContractParameters } from 'wagmi'

import { isZeroAddress } from 'core-kit/utils'

type UseStaticCallVariables = Pick<
  Required<UseReadContractParameters>,
  'functionName' | 'abi' | 'address' | 'chainId'
> & {
  disabled?: boolean
  args: unknown[]
  refetchInterval?: number
}

export const makeStaticCall = async <T>({
  functionName,
  address,
  abi,
  args,
  publicClient,
}: Omit<UseStaticCallVariables, 'disabled' | 'refetchInterval' | 'chainId'> & {
  publicClient: ReturnType<typeof usePublicClient>
}): Promise<T | undefined> => {
  const simulation = await publicClient?.simulateContract({
    address,
    abi,
    functionName,
    args,
  })
  return simulation?.result
}

export const useStaticCallQuery = <T>({
  disabled,
  functionName,
  address,
  abi,
  args,
  chainId,
  refetchInterval,
}: UseStaticCallVariables): UseQueryResult<T> => {
  const publicClient = usePublicClient({ chainId })

  return useQuery({
    queryKey: [{ functionName, address, args, chainId }],
    queryFn: async ({ queryKey: [params] }) => {
      if (params) {
        return await makeStaticCall<T>({
          address,
          abi,
          functionName: params.functionName,
          args: params.args,
          publicClient,
        })
      }
    },
    enabled:
      !disabled && !!chainId && !isZeroAddress(address) && !!functionName,
    refetchInterval,
  })
}
