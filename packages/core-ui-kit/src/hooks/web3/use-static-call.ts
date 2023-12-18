import isEqual from 'lodash.isequal'
import { useEffect, useRef, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { UseContractReadConfig } from 'wagmi'

import { AddressZero } from 'const'

import type { ContractId } from 'const'
import { useNetwork } from 'hooks/web3'
import type { Address } from 'types'

import {
  getContractAbiById,
  getContractAddressById,
  isEqualAddress,
} from 'utils'

type UseStaticCallVariables = Pick<
  UseContractReadConfig,
  'chainId' | 'functionName'
> & {
  contractId: ContractId
  disabled?: boolean
  args: unknown[]
  dynamicContractAddress?: Address
}

export const useStaticCall = <T>({
  dynamicContractAddress,
  contractId,
  args,
  chainId,
  disabled,
  functionName,
}: UseStaticCallVariables): T | undefined => {
  const [result, setResult] = useState<T>()
  const publicClient = usePublicClient({ chainId })
  const { supportedChainId } = useNetwork()
  const contractAddress =
    dynamicContractAddress ??
    getContractAddressById(contractId, chainId ?? supportedChainId)

  const ref = useRef<unknown[]>()

  useEffect(() => {
    if (
      disabled ||
      !chainId ||
      isEqualAddress(contractAddress, AddressZero) ||
      !functionName ||
      isEqual(args, ref.current)
    ) {
      return
    }

    const makeStaticCall = async () => {
      try {
        ref.current = args
        const { result } = await publicClient.simulateContract({
          address: contractAddress,
          abi: getContractAbiById(contractId),
          functionName,
          args,
        })
        setResult(result as T)
      } catch {
        setResult(undefined)
      }
    }
    makeStaticCall()
  }, [
    args,
    chainId,
    contractAddress,
    contractId,
    disabled,
    functionName,
    publicClient,
  ])

  return result
}
