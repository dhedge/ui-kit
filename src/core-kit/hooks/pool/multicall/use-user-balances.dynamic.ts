import chunk from 'lodash.chunk'

import type { UseReadContractsReturnType } from 'wagmi'
import { optimism } from 'wagmi/chains'

import { PoolLogicAbi } from 'core-kit/abi'
import { AddressZero, DEFAULT_POLLING_INTERVAL } from 'core-kit/const'
import { useTradingPanelPoolConfigs } from 'core-kit/hooks/state'
import { useNetwork, useReadContracts } from 'core-kit/hooks/web3'
import type { Address, PoolContractAccountCallParams } from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

type UseUserBalancesDynamicParams = {
  account: Address
}

type UserBalancesMap = Record<
  Address,
  {
    balance: string | undefined
    tokenPrice: string | undefined
  }
>

const getPoolContracts = ({
  account,
  chainId,
  address,
}: PoolContractAccountCallParams) =>
  [
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'balanceOf',
      chainId,
      args: [account],
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'tokenPrice',
      chainId,
      args: [],
    },
  ] as const

const getContracts = (pools: PoolContractAccountCallParams[]) =>
  pools.flatMap(getPoolContracts)

const POOL_CHUNK_SIZE = getPoolContracts({
  account: AddressZero,
  chainId: optimism.id,
  address: AddressZero,
}).length

export const useUserBalancesDynamic = ({
  account,
}: UseUserBalancesDynamicParams): UseReadContractsReturnType<
  ReturnType<typeof getPoolContracts>,
  true,
  UserBalancesMap
> => {
  const { chainId } = useNetwork()
  const pools = useTradingPanelPoolConfigs()

  return useReadContracts({
    contracts: getContracts(pools.map((pool) => ({ ...pool, account }))),
    query: {
      select: (data) =>
        chunk(data, POOL_CHUNK_SIZE).reduce<UserBalancesMap>(
          (acc, [balanceOf, tokenPrice], index) => {
            const poolAddress = pools?.[index]?.address ?? AddressZero

            return {
              ...acc,
              [poolAddress]: {
                balance: balanceOf?.result?.toString(),
                tokenPrice: tokenPrice?.result?.toString(),
              },
            }
          },
          {},
        ),
      placeholderData: (previousValue, previousQuery) => {
        if (previousQuery?.queryKey?.[1].chainId !== chainId) {
          return previousValue
        }
      },
      refetchInterval: DEFAULT_POLLING_INTERVAL,
      enabled: !isZeroAddress(account),
    },
  })
}
