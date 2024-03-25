import { useMemo } from 'react'

import { DHedgeStakingV2Abi as abi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'

import {
  useAccount,
  useContractReadsErrorLogging,
  useReadContract,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type { Address } from 'core-kit/types'
import { getContractAddressById } from 'core-kit/utils'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'
import type { ContractStakeData } from 'trading-widget/types'

export const useUserStakedPools = ():
  | { address: Address; amount: string }[]
  | undefined => {
  const { account } = useAccount()
  const { stakingChainId } = useConfigContextParams()

  const address = getContractAddressById('stakingV2', stakingChainId)

  const { data: userBalances } = useReadContract({
    address,
    abi,
    chainId: stakingChainId,
    functionName: 'balanceOf',
    args: [account ?? AddressZero],
    query: { staleTime: Infinity, enabled: !!account },
  })

  const { data: stakeIds } = useReadContracts({
    contracts: Array.from(
      Array(userBalances ? Number(userBalances) : 0).keys(),
    ).map((index) => ({
      address,
      abi,
      chainId: stakingChainId,
      functionName: 'tokenOfOwnerByIndex',
      args: [account ?? AddressZero, index],
    })),
    query: {
      staleTime: Infinity,
      enabled: !!account,
    },
  })
  useContractReadsErrorLogging(stakeIds)

  const { data } = useReadContracts({
    contracts: stakeIds?.map((stakeId) => ({
      address,
      abi,
      chainId: stakingChainId,
      functionName: 'getStake',
      args: [stakeId?.result ?? BigInt(0)],
    })),
    query: {
      enabled: !!stakeIds?.length,
    },
  })
  useContractReadsErrorLogging(data)

  return useMemo(
    () =>
      (data as { result: ContractStakeData }[] | undefined)
        ?.filter(
          ({ result }) =>
            !result?.unstaked && result?.dhedgePoolAddress !== AddressZero,
        )
        .map(({ result }) => ({
          address: result?.dhedgePoolAddress.toLowerCase() as Address,
          amount: result?.dhedgePoolAmount.toString(),
        })),
    [data],
  )
}
