import { optimism } from 'const'
import * as poolMulticallHooks from 'hooks/pool/multicall'
import * as stateHooks from 'hooks/state'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { useManagerLogicAddress } from './use-manager-logic-address'

vi.mock('hooks/state', () => ({
  useTradingPanelPoolFallbackData: vi.fn(),
}))

vi.mock('hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))

describe('useManagerLogicAddress', () => {
  it('should return managerLogicAddress from fallbackData in case it contains managerLogicAddress', async () => {
    const poolManagerLogic = { managerLogicAddress: '0x' }
    const fallbackData = { managerLogicAddress: TEST_ADDRESS }

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )

    vi.mocked(poolMulticallHooks.usePoolStatic).mockImplementation(
      () =>
        ({
          data: { poolManagerLogic },
        }) as unknown as ReturnType<typeof poolMulticallHooks.usePoolStatic>,
    )

    const { result } = renderHook(() =>
      useManagerLogicAddress({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(fallbackData.managerLogicAddress)
  })

  it('should return poolManagerLogic from PoolStatic data when fallbackData is missing', async () => {
    const poolManagerLogic = TEST_ADDRESS
    const fallbackData = { managerLogicAddress: undefined }

    vi.mocked(stateHooks.useTradingPanelPoolFallbackData).mockImplementation(
      () =>
        [fallbackData, vi.fn()] as unknown as ReturnType<
          typeof stateHooks.useTradingPanelPoolFallbackData
        >,
    )
    vi.mocked(poolMulticallHooks.usePoolStatic).mockImplementation(
      () =>
        ({
          data: { poolManagerLogic },
        }) as ReturnType<typeof poolMulticallHooks.usePoolStatic>,
    )

    const { result } = renderHook(() =>
      useManagerLogicAddress({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(poolManagerLogic)
  })
})
