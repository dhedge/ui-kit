import {
  DEFAULT_PRECISION,
  SHORTEN_POLLING_INTERVAL,
  optimism,
} from 'core-kit/const'

import { useAssetPrice } from 'core-kit/hooks/trading/use-asset-price'
import { useRawAssetPrice } from 'core-kit/hooks/trading/use-raw-asset-price'
import { formatUnits } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('./use-raw-asset-price', () => ({
  useRawAssetPrice: vi.fn(),
}))

describe('useAssetPrice', () => {
  it('should call useRawAssetPrice', async () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id

    renderHook(() =>
      useAssetPrice({
        address,
        chainId,
      }),
    )

    expect(vi.mocked(useRawAssetPrice)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(useRawAssetPrice)).toHaveBeenCalledWith({
      address,
      chainId,
      refetchInterval: SHORTEN_POLLING_INTERVAL,
    })
  })

  it('should return formatted price', async () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const price = BigInt(1)

    vi.mocked(useRawAssetPrice).mockReturnValue(price)

    const { result } = renderHook(() =>
      useAssetPrice({
        address,
        chainId,
      }),
    )

    expect(result.current).toEqual(formatUnits(price, DEFAULT_PRECISION))
  })
})
