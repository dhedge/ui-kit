import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { usePublicClient } from 'wagmi'
import type { UseReadContractParameters } from 'wagmi'

import type { ContractId } from 'core-kit/const'
import { useNetwork } from 'core-kit/hooks/web3'
import type { Address } from 'core-kit/types'

import {
  getContractAbiById,
  getContractAddressById,
  isZeroAddress,
} from 'core-kit/utils'

type UseStaticCallVariables = Pick<
  Required<UseReadContractParameters>,
  'chainId' | 'functionName'
> & {
  contractId: ContractId
  disabled?: boolean
  args: unknown[]
  dynamicContractAddress?: Address
}

export const useStaticCallQuery = <T>({
  disabled,
  functionName,
  dynamicContractAddress,
  contractId,
  args,
  chainId,
}: UseStaticCallVariables): UseQueryResult<T> => {
  const publicClient = usePublicClient({ chainId })
  const { supportedChainId } = useNetwork()

  const contractAddress =
    dynamicContractAddress ??
    getContractAddressById(contractId, chainId ?? supportedChainId)

  return useQuery({
    queryKey: [
      { functionName, dynamicContractAddress, contractId, args, chainId },
    ],
    queryFn: async ({ queryKey: [params] }) => {
      if (params) {
        const simulation = await publicClient?.simulateContract({
          address: contractAddress,
          abi: getContractAbiById(params.contractId),
          functionName: params.functionName,
          args: params.args,
        })

        return simulation?.result
      }
    },
    enabled:
      !disabled &&
      !!chainId &&
      !isZeroAddress(contractAddress) &&
      !!functionName,
  })
}
