import { optimism } from 'core-kit/const'
import { useUserMulticall } from 'core-kit/hooks/user/multicall/use-user-multicall'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsDhedgePool } from './use-is-dhedge-pool'

vi.mock('core-kit/hooks/user/multicall/use-user-multicall', () => ({
  useUserMulticall: vi.fn(),
}))

describe('useIsDhedgePool', () => {
  it('should return isPool from PoolStatic data', async () => {
    const isUserDhedgePool = true

    vi.mocked(useUserMulticall).mockImplementation(
      () =>
        ({
          data: { isUserDhedgePool },
        }) as ReturnType<typeof useUserMulticall>,
    )

    const { result } = renderHook(() =>
      useIsDhedgePool({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(useUserMulticall)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(useUserMulticall)).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(isUserDhedgePool)
  })
})
