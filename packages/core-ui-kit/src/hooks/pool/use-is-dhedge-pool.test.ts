import { optimism } from 'const'
import * as poolMulticallHooks from 'hooks/pool/multicall'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { useIsDhedgePool } from './use-is-dhedge-pool'

vi.mock('hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))

describe('useIsDhedgePool', () => {
  it('should return isPool from PoolStatic data', async () => {
    const isPool = true

    vi.mocked(poolMulticallHooks.usePoolStatic).mockImplementation(
      () =>
        ({
          data: { isPool },
        }) as ReturnType<typeof poolMulticallHooks.usePoolStatic>,
    )

    const { result } = renderHook(() =>
      useIsDhedgePool({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(isPool)
  })
})
