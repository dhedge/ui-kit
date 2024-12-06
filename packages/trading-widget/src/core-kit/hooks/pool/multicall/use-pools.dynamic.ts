import chunk from 'lodash.chunk'

import type { UseReadContractsReturnType } from 'wagmi'
import { optimism } from 'wagmi/chains'

import { PoolLogicAbi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useTradingPanelPoolConfigs } from 'core-kit/hooks/state'
import { useAccount, useReadContracts } from 'core-kit/hooks/web3'
import type {
  Address,
  ContractFunctionReturnType,
  DynamicPoolContractData,
  PoolContractAccountCallParams,
} from 'core-kit/types'

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
      args: [account ?? AddressZero],
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'tokenPrice',
      chainId,
      args: [],
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'getFundSummary',
      chainId,
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'getExitRemainingCooldown',
      chainId,
      args: [account ?? AddressZero],
    },
  ] as const

type GetFundSummary = ContractFunctionReturnType<
  typeof PoolLogicAbi,
  'view',
  'getFundSummary'
>

type PoolsMap = Record<Address, DynamicPoolContractData>

type UsePoolsDynamicParams = {
  account?: Address
}

const getContracts = (pools: PoolContractAccountCallParams[]) =>
  pools.flatMap(getPoolContracts)

const POOL_CHUNK_SIZE = getPoolContracts({
  account: AddressZero,
  chainId: optimism.id,
  address: AddressZero,
}).length

export const usePoolsDynamic = ({
  account,
}: UsePoolsDynamicParams = {}): UseReadContractsReturnType<
  ReturnType<typeof getPoolContracts>,
  true,
  PoolsMap
> => {
  const { account: connectedAccount } = useAccount()
  const pools = useTradingPanelPoolConfigs()
  const accountAddress = account ?? connectedAccount ?? AddressZero

  return useReadContracts({
    contracts: getContracts(
      pools.map((pool) => ({ ...pool, account: accountAddress })),
    ),
    query: {
      select: (data) =>
        chunk(data, POOL_CHUNK_SIZE).reduce<PoolsMap>(
          (
            acc,
            [balanceOf, tokenPrice, getFundSummary, getExitRemainingCooldown],
            index,
          ) => {
            const poolAddress = pools?.[index]?.address ?? AddressZero
            const summary = getFundSummary?.result as GetFundSummary

            return {
              ...acc,
              [poolAddress]: {
                userBalance: balanceOf?.result?.toString(),
                tokenPrice: tokenPrice?.result?.toString(),
                getExitRemainingCooldown:
                  getExitRemainingCooldown?.result?.toString(),
                totalValue: summary?.totalFundValue?.toString(),
                totalSupply: summary?.totalSupply?.toString(),
                isPrivateVault: summary?.privatePool,
                performanceFee: summary?.performanceFeeNumerator?.toString(),
                streamingFee: summary?.managerFeeNumerator?.toString(),
                entryFee: summary?.entryFeeNumerator?.toString(),
                exitFee: summary?.exitFeeNumerator?.toString(),
                managerAddress: summary?.manager?.toString(),
              },
            }
          },
          {},
        ),
    },
  })
}
