import { expect } from 'vitest'

import { PoolFactoryAbi } from 'core-kit/abi'
import { DHEDGE_SYNTHETIX_V3_ASSETS_MAP, optimism } from 'core-kit/const'
import * as web3Hooks from 'core-kit/hooks/web3'

import { getContractAddressById } from 'core-kit/utils'
import { renderHook } from 'tests/test-utils'

import { useSynthetixV3AssetBalance } from './use-synthetix-v3-asset-balance'

vi.mock('core-kit/hooks/web3', () => ({
  useStaticCallQuery: vi.fn(),
  useReadContract: vi.fn(),
}))

describe('useSynthetixV3AssetBalance', () => {
  it('should call useStaticCallQuery with the correct parameters', () => {
    const vaultAddress = '0x01'
    const synthetixAssetGuard = '0x02'
    const expectedResult = BigInt(10)
    vi.mocked(web3Hooks.useStaticCallQuery).mockImplementationOnce(
      () =>
        ({
          data: expectedResult,
          error: null,
        }) as ReturnType<typeof web3Hooks.useStaticCallQuery>,
    )
    vi.mocked(web3Hooks.useReadContract)
      .mockImplementationOnce(
        () =>
          ({
            data: synthetixAssetGuard,
          }) as ReturnType<typeof web3Hooks.useReadContract>,
      )
      .mockImplementationOnce(
        () =>
          ({
            data: undefined,
          }) as ReturnType<typeof web3Hooks.useReadContract>,
      )

    const { result } = renderHook(() =>
      useSynthetixV3AssetBalance({
        vaultAddress,
        chainId: optimism.id,
        disabled: false,
      }),
    )
    expect(web3Hooks.useReadContract).toHaveBeenCalledTimes(2)
    expect(web3Hooks.useReadContract).toHaveBeenCalledWith({
      address: getContractAddressById('factory', optimism.id),
      chainId: optimism.id,
      abi: PoolFactoryAbi,
      functionName: 'getAssetGuard',
      args: [DHEDGE_SYNTHETIX_V3_ASSETS_MAP[optimism.id]],
      query: expect.objectContaining({
        enabled: true,
        staleTime: Infinity,
      }),
    })
    expect(web3Hooks.useReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: false,
        }),
        functionName: 'getBalance',
      }),
    )
    expect(web3Hooks.useStaticCallQuery).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useStaticCallQuery).toHaveBeenCalledWith({
      chainId: optimism.id,
      contractId: 'synthetixV3AssetGuard',
      dynamicContractAddress: synthetixAssetGuard,
      disabled: false,
      functionName: 'getBalanceMutable',
      args: [vaultAddress, DHEDGE_SYNTHETIX_V3_ASSETS_MAP[optimism.id]],
    })

    expect(result.current).toBe('10')
  })
})
