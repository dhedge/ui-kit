import { PoolLogicAbi, PoolManagerLogicAbi } from 'abi'
import { AddressZero } from 'const'
import { useManagerLogicAddress } from 'hooks/pool/use-manager-logic-address'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'hooks/web3'
import type {
  Address,
  MulticallReturnType,
  PoolContractCallParams,
} from 'types'
import { isZeroAddress } from 'utils'

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
