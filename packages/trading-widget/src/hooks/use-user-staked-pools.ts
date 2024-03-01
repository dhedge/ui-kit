import { DHedgeStakingV2Abi as abi } from '@dhedge/core-ui-kit/abi'
import { AddressZero } from '@dhedge/core-ui-kit/const'

import {
  useAccount,
  useContractReadsErrorLogging,
  useReadContract,
  useReadContracts,
} from '@dhedge/core-ui-kit/hooks/web3'
import type { Address } from '@dhedge/core-ui-kit/types'
import { getContractAddressById } from '@dhedge/core-ui-kit/utils'
import { useMemo } from 'react'

import { useConfigContextParams } from 'providers/config-provider'
import type { ContractStakeData } from 'types'

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
