import { erc20Abi } from 'abi'
import { useInvalidateOnBlock, useReadContract } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'

export const useTokenAllowance = (
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address,
  chainId: ChainId,
  skip: boolean,
): ReturnType<typeof useReadContract> => {
  const query = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
    chainId,
    query: {
      enabled: !skip,
      staleTime: 15_000,
    },
  })

  useInvalidateOnBlock({ queryKey: query.queryKey })

  return query
}
