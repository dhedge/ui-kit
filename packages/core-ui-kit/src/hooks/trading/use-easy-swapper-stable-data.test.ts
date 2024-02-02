import { renderHook } from '@testing-library/react'

import { DhedgeEasySwapperAbi } from 'abi'
import { optimism } from 'const'
import * as web3Hooks from 'hooks/web3'
import { TEST_ADDRESS } from 'tests/mocks'

import { useEasySwapperStableData } from './use-easy-swapper-stable-data'

vi.mock('hooks/web3', () => ({
  useReadContracts: vi.fn(),
  useContractReadsErrorLogging: vi.fn(),
}))

describe('useEasySwapperStableData', () => {
  it('should call allowedPools, feeNumerator and feeDenominator methods on DhedgeEasySwapperAbi', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const isEasySwapperAllowedPool = true
    const feeNumerator = BigInt(1)
    const feeDenominator = BigInt(2)

    vi.mocked(web3Hooks.useReadContracts).mockReturnValue({
      data: [
        { result: isEasySwapperAllowedPool },
        { result: feeNumerator },
        { result: feeDenominator },
      ],
    } as ReturnType<typeof web3Hooks.useReadContracts>)

    renderHook(() =>
      useEasySwapperStableData({
        poolAddress,
        chainId,
      }),
    )

    expect(vi.mocked(web3Hooks.useReadContracts)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useReadContracts)).toHaveBeenCalledWith(
      expect.objectContaining({
        contracts: expect.arrayContaining([
          expect.objectContaining({
            abi: DhedgeEasySwapperAbi,
            functionName: 'allowedPools',
            args: [poolAddress],
            chainId,
          }),
          expect.objectContaining({
            abi: DhedgeEasySwapperAbi,
            functionName: 'feeNumerator',
            chainId,
          }),
          expect.objectContaining({
            abi: DhedgeEasySwapperAbi,
            functionName: 'feeDenominator',
            chainId,
          }),
        ]),
      }),
    )
  })

  it('should return allowedPools, feeNumerator and feeDenominator data', () => {
    const poolAddress = TEST_ADDRESS
    const chainId = optimism.id
    const isEasySwapperAllowedPool = true
    const feeNumerator = BigInt(1)
    const feeDenominator = BigInt(2)

    vi.mocked(web3Hooks.useReadContracts).mockReturnValue({
      data: [
        { result: isEasySwapperAllowedPool },
        { result: feeNumerator },
        { result: feeDenominator },
      ],
    } as ReturnType<typeof web3Hooks.useReadContracts>)

    const { result } = renderHook(() =>
      useEasySwapperStableData({
        poolAddress,
        chainId,
      }),
    )

    expect(result.current).toEqual({
      isEasySwapperAllowedPool,
      feeNumerator,
      feeDenominator,
    })
  })
})
