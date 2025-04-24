import { PoolFactoryAbi } from 'core-kit/abi'
import { FLAT_MONEY_UNIT_ADDRESSES } from 'core-kit/const'
import { usePoolComposition } from 'core-kit/hooks/pool/use-pool-composition'
import { useReadContracts } from 'core-kit/hooks/web3'
import type { PoolContractCallParams } from 'core-kit/types'
import { getContractAddressById, isEqualAddress } from 'core-kit/utils'

const SINGLE_ASSET_WITHDRAW_BLOCKERS = [...FLAT_MONEY_UNIT_ADDRESSES]

export const useHasSingleAssetWithdrawBlockers = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const composition = usePoolComposition({
    address,
    chainId,
  })
  const poolFactoryAddress = getContractAddressById('factory', chainId)

  return useReadContracts({
    contracts: composition.map(({ tokenAddress }) => ({
      address: poolFactoryAddress,
      abi: PoolFactoryAbi,
      functionName: 'isPool',
      chainId,
      args: [tokenAddress],
    })),
    query: {
      select: (data) =>
        composition.some(({ amount, tokenAddress }, index) => {
          const isPool = !!data[index]?.result
          const isBlocker =
            isPool ||
            SINGLE_ASSET_WITHDRAW_BLOCKERS.some((token) =>
              isEqualAddress(token, tokenAddress),
            )
          return isBlocker && amount !== '0'
        }),
      staleTime: Infinity,
    },
  })
}
