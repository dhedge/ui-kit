import { PoolFactoryAbi } from 'core-kit/abi'
import { optimism } from 'core-kit/const'
import { useRawAssetPrice } from 'core-kit/hooks/trading/use-raw-asset-price'
import * as web3Hooks from 'core-kit/hooks/web3'

import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

vi.mock('core-kit/hooks/web3', () => ({
  useReadContracts: vi.fn(),
  useNetwork: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
  useInvalidateOnBlock: vi.fn(),
}))

describe('useRawAssetPrice', () => {
  it('should call getAssetPrice method on PoolFactoryAbi with proper params', async () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const assetPrice = BigInt(1)

    vi.mocked(web3Hooks.useNetwork).mockImplementation(
      () =>
        ({ supportedChainId: chainId }) as ReturnType<
          typeof web3Hooks.useNetwork
        >,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: assetPrice }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    renderHook(() =>
      useRawAssetPrice({
        address,
        chainId,
      }),
    )

    expect(vi.mocked(web3Hooks.useReadContracts)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useReadContracts)).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            abi: PoolFactoryAbi,
            functionName: 'getAssetPrice',
            args: [address],
            chainId,
          }),
        ]),
      }),
    )
  })

  it('should return asset price', async () => {
    const address = TEST_ADDRESS
    const chainId = optimism.id
    const assetPrice = BigInt(1)

    vi.mocked(web3Hooks.useNetwork).mockImplementation(
      () =>
        ({ supportedChainId: chainId }) as ReturnType<
          typeof web3Hooks.useNetwork
        >,
    )
    vi.mocked(web3Hooks.useReadContracts).mockImplementation(
      () =>
        ({
          data: [{ result: assetPrice }],
        }) as ReturnType<typeof web3Hooks.useReadContracts>,
    )

    const { result } = renderHook(() =>
      useRawAssetPrice({
        address,
        chainId,
      }),
    )

    expect(result.current).toEqual(assetPrice)
  })
})
