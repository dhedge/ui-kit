import { DEFAULT_PRECISION } from 'const'
import type { ChainId, PoolContractCallParams } from 'types/web3.types'
import { formatUnits } from 'utils'

import { useRawAssetPrice } from './use-raw-asset-price'

type AssetPriceParams = PoolContractCallParams & {
  chainId: ChainId
  watch?: boolean
  disabled?: boolean
}

export const useAssetPrice = ({
  address,
  chainId,
  watch,
  disabled,
}: AssetPriceParams): string => {
  const price = useRawAssetPrice({ address, chainId, watch, disabled })
  return formatUnits(price ?? BigInt(0), DEFAULT_PRECISION)
}
