import { DEFAULT_PRECISION, optimism } from 'core-kit/const'

import { formatUnits } from 'core-kit/utils'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useAssetPrice } from './use-asset-price'
import { useRawAssetPrice } from './use-raw-asset-price'

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
      watch: undefined,
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
