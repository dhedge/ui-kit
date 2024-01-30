import { PoolLogicAbi } from 'abi'
import { optimism } from 'const'
import * as stateHooks from 'hooks/state'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { useManagerLogicAddress } from './use-manager-logic-address'
import { expect } from 'vitest'

vi.mock('hooks/web3', () => ({
  useReadContract: vi.fn(),
  useContractReadErrorLogging: vi.fn(),
}))

vi.mock('hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

describe('useManagerLogicAddress', () => {
  it('should skip calling  poolManagerLogic method on PoolLogicAbi when fallbackData contains managerLogicAddress', async () => {
    const poolManagerLogic = TEST_ADDRESS
    const fallbackData = { managerLogicAddress: TEST_ADDRESS }

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(web3Hooks.useReadContract).mockImplementation(
      () =>
        ({
          data: poolManagerLogic,
        }) as ReturnType<typeof web3Hooks.useReadContract>,
    )

    const { result } = renderHook(() =>
      useManagerLogicAddress({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(web3Hooks.useReadContract)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useReadContract)).toHaveBeenCalledWith(
      expect.objectContaining({
        query: {
          staleTime: Infinity,
          enabled: false,
        },
      }),
    )
    expect(result.current).toBe(fallbackData.managerLogicAddress)
  })

  it('should call poolManagerLogic method on PoolLogicAbi when fallbackData is missing', async () => {
    const poolManagerLogic = TEST_ADDRESS
    const fallbackData = { managerLogicAddress: undefined }

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(web3Hooks.useReadContract).mockImplementation(
      () =>
        ({
          data: poolManagerLogic,
        }) as ReturnType<typeof web3Hooks.useReadContract>,
    )

    const { result } = renderHook(() =>
      useManagerLogicAddress({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(web3Hooks.useReadContract)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(web3Hooks.useReadContract)).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'poolManagerLogic',
        abi: PoolLogicAbi,
        query: expect.objectContaining({
          staleTime: Infinity,
        }),
      }),
    )
    expect(result.current).toBe(poolManagerLogic)
  })
})
