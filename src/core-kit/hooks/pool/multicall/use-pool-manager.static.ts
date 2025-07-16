import { PoolManagerLogicAbi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useManagerLogicAddress } from 'core-kit/hooks/pool/use-manager-logic-address'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractAccountCallParams,
  PoolContractCallParams,
} from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

const getContracts = ({
  address,
  chainId,
  account,
}: PoolContractAccountCallParams) =>
  [
    {
      address,
      abi: PoolManagerLogicAbi,
      functionName: 'getFeeIncreaseInfo',
      chainId,
    },
    {
      address,
      abi: PoolManagerLogicAbi,
      functionName: 'minDepositUSD',
      chainId,
    },
    {
      address,
      abi: PoolManagerLogicAbi,
      functionName: 'isMemberAllowed',
      args: [account ?? AddressZero],
      chainId,
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  getFeeIncreaseInfo: data[0].result,
  minDepositUSD: data[1].result,
  isMemberAllowed: data[2].result,
})

export const usePoolManagerStatic = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const managerLogicAddress = useManagerLogicAddress({ address, chainId })
  const { account = AddressZero } = useAccount()

  const result = useReadContracts({
    contracts: getContracts({
      address: managerLogicAddress ?? AddressZero,
      chainId,
      account,
    }),
    query: {
      enabled: !!managerLogicAddress && !isZeroAddress(managerLogicAddress),
      staleTime: Infinity,
      select: selector,
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
