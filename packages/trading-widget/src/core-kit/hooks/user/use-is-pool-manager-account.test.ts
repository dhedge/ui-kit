import { optimism } from 'core-kit/const'
import { useIsDhedgePool } from 'core-kit/hooks/pool'
import * as web3Hooks from 'core-kit/hooks/web3'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsPoolManagerAccount } from './use-is-pool-manager-account'

vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
  useNetwork: vi.fn(),
}))

vi.mock('core-kit/hooks/pool', () => ({
  useIsDhedgePool: vi.fn(),
}))

describe('useIsPoolManagerAccount', () => {
  it('should call isPool method on PoolFactoryAbi', async () => {
    const isPool = true

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(web3Hooks.useNetwork).mockImplementation(
      () =>
        ({
          chainId: optimism.id,
          supportedChainId: optimism.id,
        }) as ReturnType<typeof web3Hooks.useNetwork>,
    )
    vi.mocked(useIsDhedgePool).mockImplementation(() => isPool)

    const { result } = renderHook(() => useIsPoolManagerAccount())

    expect(vi.mocked(useIsDhedgePool)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(useIsDhedgePool)).toHaveBeenCalledWith(
      expect.objectContaining({ address: TEST_ADDRESS, chainId: optimism.id }),
    )
    expect(result.current).toBe(isPool)
  })
})
