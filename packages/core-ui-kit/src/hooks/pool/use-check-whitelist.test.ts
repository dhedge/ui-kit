import { optimism } from 'const'
import * as poolMulticallHooks from 'hooks/pool/multicall'
import * as web3Hooks from 'hooks/web3'
import { renderHook } from 'test-utils'
import { TEST_ADDRESS } from 'tests/mocks'

import { useCheckWhitelist } from './use-check-whitelist'

vi.mock('hooks/web3', () => ({
  useAccount: vi.fn(),
}))

vi.mock('hooks/pool/multicall', () => ({
  usePoolStatic: vi.fn(),
}))

describe('useCheckWhitelist', () => {
  it('should return isMemberAllowed from PoolStatic data', async () => {
    const isMemberAllowed = true

    vi.mocked(web3Hooks.useAccount).mockImplementation(
      () =>
        ({
          account: TEST_ADDRESS,
        }) as ReturnType<typeof web3Hooks.useAccount>,
    )
    vi.mocked(poolMulticallHooks.usePoolStatic).mockImplementation(
      () =>
        ({
          data: { isMemberAllowed },
        }) as ReturnType<typeof poolMulticallHooks.usePoolStatic>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledWith({
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
    vi.mocked(poolMulticallHooks.usePoolStatic).mockImplementation(
      () =>
        ({
          data: { isMemberAllowed },
        }) as ReturnType<typeof poolMulticallHooks.usePoolStatic>,
    )

    const { result } = renderHook(() =>
      useCheckWhitelist({ address: TEST_ADDRESS, chainId: optimism.id }),
    )

    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(poolMulticallHooks.usePoolStatic)).toHaveBeenCalledWith({
      address: TEST_ADDRESS,
      chainId: optimism.id,
    })
    expect(result.current).toBe(false)
  })
})
