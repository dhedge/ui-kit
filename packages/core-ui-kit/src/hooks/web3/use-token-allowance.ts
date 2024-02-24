import { erc20Abi } from 'abi'
import { DEFAULT_POLLING_INTERVAL } from 'const'
import { useReadContract } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'

export const useTokenAllowance = (
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address,
  chainId: ChainId,
  skip: boolean,
): ReturnType<typeof useReadContract> => {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
    chainId,
    query: {
      enabled: !skip,
      refetchInterval: DEFAULT_POLLING_INTERVAL,
    },
  })
}
