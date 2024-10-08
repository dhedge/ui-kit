import { optimism } from 'core-kit/const'
import * as poolMulticallHooks from 'core-kit/hooks/pool/multicall'
import * as web3Hooks from 'core-kit/hooks/web3'
import { TEST_ADDRESS } from 'tests/mocks'
import { renderHook } from 'tests/test-utils'

import { useCheckWhitelist } from './use-check-whitelist'

vi.mock('core-kit/hooks/web3', () => ({
  useAccount: vi.fn(),
}))

vi.mock('core-kit/hooks/pool/multicall', () => ({
  usePoolManagerStatic: vi.fn(),
}))

describe('useCheckWhitelist', () => {
  it('should return isMemberAllowed from PoolManagerStatic data', async () => {
    const isMemberAllowed = true

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { isMemberAllowed },
        }) as ReturnType<typeof poolMulticallHooks.usePoolManagerStatic>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(isMemberAllowed)
  })

  it('should return false for disconnected account', async () => {
    const account = undefined
    const isMemberAllowed = true

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(poolMulticallHooks.usePoolManagerStatic).mockImplementation(
      () =>
        ({
          data: { isMemberAllowed },
        }) as ReturnType<typeof poolMulticallHooks.usePoolManagerStatic>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledTimes(1)
    expect(
      vi.mocked(poolMulticallHooks.usePoolManagerStatic),
    ).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(false)
  })
})
