import { DEFAULT_PRECISION, SHORTEN_POLLING_INTERVAL } from 'core-kit/const'
import { useRawAssetPrice } from 'core-kit/hooks/trading/use-raw-asset-price'
import type { ChainId, PoolContractCallParams } from 'core-kit/types/web3.types'
import { formatUnits } from 'core-kit/utils'

type AssetPriceParams = PoolContractCallParams & {
  chainId: ChainId
  disabled?: boolean
  refetchInterval?: number
}

export const useAssetPrice = ({
  address,
  chainId,
  refetchInterval = SHORTEN_POLLING_INTERVAL,
  disabled,
}: AssetPriceParams): string => {
  const price = useRawAssetPrice({
    address,
    chainId,
    refetchInterval,
    disabled,
  })
  return formatUnits(price ?? BigInt(0), DEFAULT_PRECISION)
}
