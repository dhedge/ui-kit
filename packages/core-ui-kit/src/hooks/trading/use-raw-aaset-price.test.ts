import { PoolFactoryAbi } from 'abi'
import { optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { TEST_ADDRESS } from 'tests/mocks'

import { useRawAssetPrice } from './use-raw-asset-price'

vi.mock('hooks/web3', () => ({
  useContractReads: vi.fn(),
  useNetwork: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
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
    vi.mocked(web3Hooks.useContractReads).mockImplementation(
      () =>
        ({
          data: [{ result: assetPrice }],
        }) as ReturnType<typeof web3Hooks.useContractReads>,
    )

    renderHook(() =>
      useRawAssetPrice({
        address,
        chainId,
      }),
    )

    expect(vi.mocked(web3Hooks.useContractReads)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useContractReads)).toHaveBeenCalledWith(
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
    vi.mocked(web3Hooks.useContractReads).mockImplementation(
      () =>
        ({
          data: [{ result: assetPrice }],
        }) as ReturnType<typeof web3Hooks.useContractReads>,
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
