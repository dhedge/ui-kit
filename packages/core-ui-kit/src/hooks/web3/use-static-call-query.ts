import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { usePublicClient } from 'wagmi'
import type { UseReadContractParameters } from 'wagmi'

import type { ContractId } from 'const'
import { useNetwork } from 'hooks/web3'
import type { Address } from 'types'

import {
  getContractAbiById,
  getContractAddressById,
  isZeroAddress,
} from 'utils'

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

        console.log({
          params,
          simulation,
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
