import { PoolLogicAbi, PoolManagerLogicAbi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useManagerLogicAddress } from 'core-kit/hooks/pool/use-manager-logic-address'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type {
  Address,
  MulticallReturnType,
  PoolContractCallParams,
} from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

type GetContractsParams = PoolContractCallParams & {
  managerLogicAddress: Address
  account: Address
}

const getContracts = ({
  address,
  chainId,
  managerLogicAddress,
  account,
}: GetContractsParams) =>
  [
    {
      address: managerLogicAddress,
      abi: PoolManagerLogicAbi,
      functionName: 'getFundComposition',
      chainId,
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'getExitRemainingCooldown',
      chainId,
      args: [account],
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  getFundComposition: data[0].result,
  getExitRemainingCooldown: data[1].result,
})

export const usePoolManagerDynamic = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const { account = AddressZero } = useAccount()
  const managerLogicAddress = useManagerLogicAddress({ address, chainId })

  const result = useReadContracts({
    contracts: getContracts({
      address,
      chainId,
      managerLogicAddress: managerLogicAddress ?? AddressZero,
      account,
    }),
    query: {
      enabled: !!managerLogicAddress && !isZeroAddress(managerLogicAddress),
      select: selector,
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
