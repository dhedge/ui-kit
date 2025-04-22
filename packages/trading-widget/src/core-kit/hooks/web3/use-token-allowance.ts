import { erc20Abi } from 'core-kit/abi'
import { DEFAULT_POLLING_INTERVAL } from 'core-kit/const'
import { useReadContract } from 'core-kit/hooks/web3'
import type { Address, ChainId } from 'core-kit/types/web3.types'

export const useTokenAllowance = ({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  chainId,
  skip,
}: {
  tokenAddress: Address
  ownerAddress: Address
  spenderAddress: Address
  chainId: ChainId
  skip?: boolean
}): ReturnType<typeof useReadContract> => {
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
