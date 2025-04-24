import { useTradingPanelPoolFallbackData } from 'core-kit/hooks/state'
import type { Address } from 'core-kit/types/web3.types'
import { formatEther } from 'core-kit/utils'

import { usePoolDynamicContractData } from './use-pool-dynamic-contract-data'

interface PoolTokenPriceParams {
  address: Address
  formatter?: (tokenPrice: bigint) => string
  disabled?: boolean
}

export const usePoolTokenPrice = ({
  address,
  formatter = formatEther,
}: PoolTokenPriceParams): string => {
  const [poolData] = useTradingPanelPoolFallbackData()

  const { tokenPrice } = usePoolDynamicContractData({ address })

  return formatter(BigInt(tokenPrice ?? poolData?.tokenPrice ?? '0'))
}
