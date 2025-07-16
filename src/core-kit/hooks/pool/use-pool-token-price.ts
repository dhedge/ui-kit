import { DEFAULT_POLLING_INTERVAL } from 'core-kit/const'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolFallbackData } from 'core-kit/hooks/state'
import type { Address, ChainId } from 'core-kit/types/web3.types'
import { formatEther } from 'core-kit/utils'

interface PoolTokenPriceParams {
  address: Address
  chainId: ChainId
  formatter?: (tokenPrice: bigint) => string
  disabled?: boolean
}

export const usePoolTokenPrice = ({
  address,
  chainId,
  formatter = formatEther,
}: PoolTokenPriceParams): string => {
  const [poolData] = useTradingPanelPoolFallbackData()

  const { data: contractData } = usePoolDynamic({
    address,
    chainId,
    refetchInterval: DEFAULT_POLLING_INTERVAL,
  })

  return formatter(
    BigInt(contractData?.tokenPrice ?? poolData?.tokenPrice ?? '0'),
  )
}
