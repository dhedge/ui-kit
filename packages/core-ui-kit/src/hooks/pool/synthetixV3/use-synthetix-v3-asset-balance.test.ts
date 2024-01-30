import { expect } from 'vitest'

import { PoolFactoryAbi } from 'abi'
import { DHEDGE_SYNTHETIX_V3_ASSETS_MAP, optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'

import { getContractAddressById } from 'utils'

import { useSynthetixV3AssetBalance } from './use-synthetix-v3-asset-balance'

vi.mock('hooks/web3', () => ({
  useStaticCall: vi.fn(),
  useReadContract: vi.fn(),
}))

describe('useSynthetixV3AssetBalance', () => {
  it('should call useStaticCall with the correct parameters', () => {
    const vaultAddress = '0x01'
    const synthetixAssetGuard = '0x02'
    const expectedResult = BigInt(10)
    vi.mocked(web3Hooks.useStaticCall).mockImplementationOnce(() => ({
      data: expectedResult,
      error: false,
    }))
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
    expect(web3Hooks.useStaticCall).toHaveBeenCalledTimes(1)
    expect(web3Hooks.useStaticCall).toHaveBeenCalledWith({
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
