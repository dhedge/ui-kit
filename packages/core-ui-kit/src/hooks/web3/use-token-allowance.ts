import { erc20ABI } from 'abi'
import { useContractRead } from 'hooks/web3'
import type { Address, ChainId } from 'types/web3.types'

export const useTokenAllowance = (
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address,
  chainId: ChainId,
  skip: boolean,
): ReturnType<typeof useContractRead> =>
  useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
    chainId,
    enabled: !skip,
    watch: true,
    staleTime: 15_000,
  })
