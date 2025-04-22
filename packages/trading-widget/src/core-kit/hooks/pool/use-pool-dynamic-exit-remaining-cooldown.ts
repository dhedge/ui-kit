import { PoolLogicAbi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useAccount, useReadContract } from 'core-kit/hooks/web3'
import type { Address, ChainId } from 'core-kit/types/web3.types'

interface PoolExitRemainingCooldownParams {
  address: Address
  chainId: ChainId
  enabled: boolean
}

export const REFETCH_INTERVALS = [
  [30 * 1000, 5000],
  [60 * 1000, 10000],
  [5 * 60 * 1000, 20000],
] as const

export const getRefetchInterval = (cooldownMs: number) => {
  if (!cooldownMs) {
    return false
  }

  for (const [refetchCooldownSec, refetchIntervalMs] of REFETCH_INTERVALS) {
    if (cooldownMs <= refetchCooldownSec) {
      return refetchIntervalMs
    }
  }

  return false
}

const select = (data?: bigint) => Number(data?.toString() ?? '0') * 1000

export const usePoolDynamicExitRemainingCooldown = ({
  address,
  chainId,
  enabled,
}: PoolExitRemainingCooldownParams) => {
  const { account } = useAccount()

  return useReadContract({
    address,
    abi: PoolLogicAbi,
    functionName: 'getExitRemainingCooldown',
    chainId,
    args: [account ?? AddressZero],
    query: {
      enabled: !!account && enabled,
      select,
      refetchInterval: (query) => getRefetchInterval(select(query.state?.data)),
      refetchOnWindowFocus: (query) => select(query.state?.data) > 0,
    },
  })
}
