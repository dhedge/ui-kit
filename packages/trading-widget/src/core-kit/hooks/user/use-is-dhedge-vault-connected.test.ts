import { optimism } from 'core-kit/const'
import { useUserMulticall } from 'core-kit/hooks/user/multicall/use-user-multicall'
import * as web3Hooks from 'core-kit/hooks/web3'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useIsDhedgeVaultConnected } from './use-is-dhedge-vault-connected'

vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
  useNetwork: vi.fn(),
}))

vi.mock('core-kit/hooks/user/multicall/use-user-multicall', () => ({
  useUserMulticall: vi.fn(),
}))

describe('useIsDhedgeVaultConnected', () => {
  it('should call isPool method on PoolFactoryAbi', async () => {
    const isUserDhedgePool = true

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
    vi.mocked(useUserMulticall).mockImplementation(
      () =>
        ({
          data: { isUserDhedgePool },
        }) as ReturnType<typeof useUserMulticall>,
    )

    const { result } = renderHook(() => useIsDhedgeVaultConnected())

    expect(vi.mocked(useUserMulticall)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(useUserMulticall)).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(isUserDhedgePool)
  })
})
