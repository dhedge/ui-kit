import { useReadContract } from 'wagmi'

import { PoolLogicAbi } from 'core-kit/abi'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import type { PoolContractAccountCallParams } from 'core-kit/types'

import { formatVaultBalance, isZeroAddress } from 'core-kit/utils'

export const useUserVaultBalance = ({
  account,
  chainId,
  address,
}: PoolContractAccountCallParams) => {
  const { data: vaultData, isFetched } = usePoolDynamic({ address, chainId })

  return useReadContract({
    address: account ? address : undefined,
    abi: PoolLogicAbi,
    functionName: 'balanceOf',
    chainId,
    args: [account],
    query: {
      enabled: !isZeroAddress(account) && isFetched,
      select: (balance) =>
        formatVaultBalance(balance, BigInt(vaultData?.tokenPrice ?? '0')),
    },
  })
}
