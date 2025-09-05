import { MULTI_CHAIN_SWAPPER_CONTRACT_ADDRESS } from 'core-kit/const'
import type { useGetSwapData } from 'core-kit/hooks/state'
import type { SwapDataRequest, SwapDataResponse } from 'core-kit/types'

export type AssetWithoutFromAddress = Omit<SwapDataRequest, 'fromAddress'>
export type SwapsDataMap<T extends string> = Record<T, SwapDataResponse | null>

interface FetchSwapsDataWithKeyParams<K extends string> {
  assets: AssetWithoutFromAddress[]
  getSwapData: ReturnType<typeof useGetSwapData>
  signal: AbortSignal
  buildKey: (asset: AssetWithoutFromAddress) => K
}

export const fetchSwapsDataWithKey = async <K extends string>({
  assets,
  getSwapData,
  signal,
  buildKey,
}: FetchSwapsDataWithKeyParams<K>): Promise<SwapsDataMap<K>> => {
  const data = await Promise.all(
    assets.map((variables) =>
      getSwapData({
        signal,
        variables: {
          ...variables,
          fromAddress: MULTI_CHAIN_SWAPPER_CONTRACT_ADDRESS,
        },
      }),
    ),
  )

  return assets.reduce((acc, asset, i) => {
    const key = buildKey(asset)
    acc[key] = data[i] ?? null
    return acc
  }, {} as SwapsDataMap<K>)
}
